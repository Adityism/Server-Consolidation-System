const express = require("express");
const Docker = require("dockerode");
const cors = require("cors");

const app = express();
const docker = new Docker();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Cost calculation constants (in Indian Rupees per hour)
const COST_RATES = {
  // Base cost per container per hour (₹)
  BASE_CONTAINER_COST: 2.5,
  // CPU cost per percentage per hour (₹)
  CPU_COST_PER_PERCENT: 0.05,
  // Memory cost per percentage per hour (₹)
  MEMORY_COST_PER_PERCENT: 0.03,
  // Idle container overhead cost per hour (₹)
  IDLE_OVERHEAD: 1.2
};

// Helper function to calculate realistic cost savings
function calculateCostSavings(cpuPercent, memoryPercent, isRunning) {
  if (!isRunning) return 0;
  
  // Calculate hourly cost based on resource usage
  const baseCost = COST_RATES.BASE_CONTAINER_COST;
  const cpuCost = cpuPercent * COST_RATES.CPU_COST_PER_PERCENT;
  const memoryCost = memoryPercent * COST_RATES.MEMORY_COST_PER_PERCENT;
  const idleOverhead = (cpuPercent < 10 && memoryPercent < 10) ? COST_RATES.IDLE_OVERHEAD : 0;
  
  const hourlyRate = baseCost + cpuCost + memoryCost + idleOverhead;
  
  // Calculate daily and monthly savings if container is stopped
  const dailySavings = hourlyRate * 24;
  const monthlySavings = dailySavings * 30;
  
  return {
    hourly: Math.round(hourlyRate * 100) / 100,
    daily: Math.round(dailySavings * 100) / 100,
    monthly: Math.round(monthlySavings * 100) / 100
  };
}

// Helper function to determine optimization recommendation
function getOptimizationRecommendation(cpuPercent, memoryPercent, status) {
  if (status !== 'running') {
    return {
      shouldOptimize: false,
      reason: 'Container is not running',
      action: 'none'
    };
  }
  
  // More sophisticated logic for optimization
  if (cpuPercent < 5 && memoryPercent < 5) {
    return {
      shouldOptimize: true,
      reason: `Extremely low resource usage: CPU ${cpuPercent}%, Memory ${memoryPercent}% - Container appears completely idle`,
      action: 'stop',
      priority: 'high'
    };
  } else if (cpuPercent < 10 && memoryPercent < 10) {
    return {
      shouldOptimize: true,
      reason: `Very low resource usage: CPU ${cpuPercent}%, Memory ${memoryPercent}% - Consider stopping or consolidating`,
      action: 'stop',
      priority: 'medium'
    };
  } else if (cpuPercent < 15 && memoryPercent < 15) {
    return {
      shouldOptimize: true,
      reason: `Low resource usage: CPU ${cpuPercent}%, Memory ${memoryPercent}% - Monitor for potential optimization`,
      action: 'monitor',
      priority: 'low'
    };
  }
  
  return {
    shouldOptimize: false,
    reason: `Normal resource usage: CPU ${cpuPercent}%, Memory ${memoryPercent}%`,
    action: 'none'
  };
}

// Helper function to get container stats
async function getContainerStats(container) {
  try {
    const stats = await container.stats({ stream: false });
    const inspect = await container.inspect();
    
    // Calculate CPU usage percentage
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;
    
    // Calculate memory usage percentage
    const memoryUsage = stats.memory_stats.usage;
    const memoryLimit = stats.memory_stats.limit;
    const memoryPercent = (memoryUsage / memoryLimit) * 100;
    
    const finalCpuPercent = isNaN(cpuPercent) ? 0 : Math.round(cpuPercent * 100) / 100;
    const finalMemoryPercent = Math.round(memoryPercent * 100) / 100;
    
    return {
      id: container.id,
      name: inspect.Name.substring(1), // Remove leading slash
      status: inspect.State.Status,
      cpu: finalCpuPercent,
      memory: finalMemoryPercent,
      created: inspect.Created,
      image: inspect.Config.Image
    };
  } catch (error) {
    console.error("Error getting container stats:", error);
    return null;
  }
}

// API Routes

// Get all containers with their stats
app.get("/api/containers", async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    const containerStats = [];
    
    for (const containerInfo of containers) {
      const container = docker.getContainer(containerInfo.Id);
      if (containerInfo.State === "running") {
        const stats = await getContainerStats(container);
        if (stats) {
          containerStats.push(stats);
        }
      } else {
        // For stopped containers, provide basic info
        containerStats.push({
          id: containerInfo.Id,
          name: containerInfo.Names[0].substring(1),
          status: containerInfo.State,
          cpu: 0,
          memory: 0,
          created: containerInfo.Created,
          image: containerInfo.Image
        });
      }
    }
    
    res.json(containerStats);
  } catch (error) {
    console.error("Error fetching containers:", error);
    res.status(500).json({ error: "Failed to fetch containers" });
  }
});

// Get idle containers with smarter logic
app.get("/api/containers/idle", async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: false }); // Only running containers
    const idleContainers = [];
    
    for (const containerInfo of containers) {
      const container = docker.getContainer(containerInfo.Id);
      const stats = await getContainerStats(container);
      
      if (stats) {
        const optimization = getOptimizationRecommendation(stats.cpu, stats.memory, stats.status);
        if (optimization.shouldOptimize) {
          idleContainers.push({
            ...stats,
            isIdle: true,
            reason: optimization.reason,
            action: optimization.action,
            priority: optimization.priority
          });
        }
      }
    }
    
    res.json(idleContainers);
  } catch (error) {
    console.error("Error fetching idle containers:", error);
    res.status(500).json({ error: "Failed to fetch idle containers" });
  }
});

// Start a container
app.post("/api/containers/:id/start", async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.start();
    res.json({ message: "Container started successfully" });
  } catch (error) {
    console.error("Error starting container:", error);
    res.status(500).json({ error: "Failed to start container" });
  }
});

// Stop a container
app.post("/api/containers/:id/stop", async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.stop();
    res.json({ message: "Container stopped successfully" });
  } catch (error) {
    console.error("Error stopping container:", error);
    res.status(500).json({ error: "Failed to stop container" });
  }
});

// Get optimization suggestions with realistic cost calculations
app.get("/api/optimization/suggestions", async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: false });
    const suggestions = [];
    let totalSavings = { hourly: 0, daily: 0, monthly: 0 };
    
    for (const containerInfo of containers) {
      const container = docker.getContainer(containerInfo.Id);
      const stats = await getContainerStats(container);
      
      if (stats) {
        const optimization = getOptimizationRecommendation(stats.cpu, stats.memory, stats.status);
        
        if (optimization.shouldOptimize && optimization.action === 'stop') {
          const costSavings = calculateCostSavings(stats.cpu, stats.memory, true);
          
          totalSavings.hourly += costSavings.hourly;
          totalSavings.daily += costSavings.daily;
          totalSavings.monthly += costSavings.monthly;
          
          suggestions.push({
            containerId: stats.id,
            containerName: stats.name,
            action: optimization.action,
            reason: optimization.reason,
            priority: optimization.priority,
            estimatedSavings: {
              hourly: costSavings.hourly,
              daily: costSavings.daily,
              monthly: costSavings.monthly
            },
            currentUsage: {
              cpu: stats.cpu,
              memory: stats.memory
            }
          });
        }
      }
    }
    
    // Round total savings
    totalSavings.hourly = Math.round(totalSavings.hourly * 100) / 100;
    totalSavings.daily = Math.round(totalSavings.daily * 100) / 100;
    totalSavings.monthly = Math.round(totalSavings.monthly * 100) / 100;
    
    res.json({
      suggestions,
      totalEstimatedSavings: totalSavings,
      currency: "INR",
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    res.status(500).json({ error: "Failed to generate optimization suggestions" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

