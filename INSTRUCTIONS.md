# Server Consolidation Optimization Dashboard

## Overview

This is an enhanced Server Consolidation Optimization Dashboard that helps monitor and optimize virtualized infrastructure. The system provides real-time container monitoring, intelligent optimization recommendations, and realistic cost savings calculations in Indian Rupees.


## Architecture

The system consists of the following components:

- **Frontend**: React application with modern UI components
- **Backend**: Node.js/Express API server with Docker integration
- **Monitoring**: Prometheus for metrics collection
- **Visualization**: Grafana for advanced monitoring dashboards
- **Container Monitoring**: cAdvisor for container metrics

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for development)
- At least 4GB RAM available for containers

## Installation & Setup

### 1. Clone/Extract the Project

```bash
# Extract the project files to your desired directory
cd /path/to/server_consolidation_system
```

### 2. Build and Start Services

```bash
# Build and start all services
docker-compose up --build -d

# Or build images manually if docker-compose has issues:
docker build -t server-consolidation-backend ./backend
docker build -t server-consolidation-frontend ./frontend

# Start containers manually:
docker run -d --name backend -p 3001:3001 -v /var/run/docker.sock:/var/run/docker.sock server-consolidation-backend
docker run -d --name frontend -p 5173:80 server-consolidation-frontend
```

### 3. Access the Application

- **Main Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)

### 4. Login Credentials

Use the following credentials to access the dashboard:
- **Username**: `admin`
- **Password**: `admin`

## API Endpoints

### Container Management
- `GET /api/containers` - List all containers with stats
- `GET /api/containers/idle` - Get containers flagged for optimization
- `POST /api/containers/:id/start` - Start a container
- `POST /api/containers/:id/stop` - Stop a container

### Optimization
- `GET /api/optimization/suggestions` - Get optimization recommendations with cost savings

### Health Check
- `GET /api/health` - API health status

## Cost Calculation Details

The system uses the following cost model (in Indian Rupees):

- **Base Container Cost**: ₹2.5 per hour
- **CPU Cost**: ₹0.05 per percentage per hour
- **Memory Cost**: ₹0.03 per percentage per hour
- **Idle Overhead**: ₹1.2 per hour (for containers with < 10% CPU and Memory)

### Example Calculation
For a container with 5% CPU and 8% Memory usage:
- Base Cost: ₹2.5
- CPU Cost: 5 × ₹0.05 = ₹0.25
- Memory Cost: 8 × ₹0.03 = ₹0.24
- Idle Overhead: ₹1.2 (since both CPU and Memory < 10%)
- **Total Hourly Cost**: ₹4.19
- **Daily Savings if stopped**: ₹100.56
- **Monthly Savings if stopped**: ₹3,016.80

## Optimization Logic

### Priority Levels

1. **High Priority** (Critical - Stop Now)
   - CPU usage < 5% AND Memory usage < 5%
   - Container appears completely idle

2. **Medium Priority** (Optimization Suggested)
   - CPU usage < 10% AND Memory usage < 10%
   - Very low resource usage, consider stopping or consolidating

3. **Low Priority** (Monitor Usage)
   - CPU usage < 15% AND Memory usage < 15%
   - Low resource usage, monitor for potential optimization

## Troubleshooting

### Common Issues

1. **Docker Permission Errors**
   ```bash
   sudo usermod -aG docker $USER
   sudo systemctl restart docker
   # Log out and log back in
   ```

2. **Port Conflicts**
   - Ensure ports 3001, 5173, 3000, 9090, and 8080 are available
   - Modify docker-compose.yml if needed

3. **Container Stats Not Showing**
   - Ensure Docker socket is properly mounted: `/var/run/docker.sock:/var/run/docker.sock`
   - Check backend logs: `docker logs backend`

4. **Frontend Not Loading**
   - Check if frontend container is running: `docker ps`
   - Verify backend API is accessible: `curl http://localhost:3001/api/health`

### Logs

```bash
# View backend logs
docker logs backend

# View frontend logs
docker logs frontend

# View all services
docker-compose logs -f
```

## Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Security Notes

- The login system uses hardcoded credentials for demo purposes
- In production, implement proper authentication with secure password storage
- Consider adding HTTPS and proper session management
- Restrict Docker socket access in production environments

## Performance Considerations

- The system auto-refreshes data every 30 seconds
- Container stats collection may impact performance with many containers
- Consider implementing caching for large deployments
- Monitor resource usage of the monitoring stack itself

## Future Enhancements

- Integration with cloud provider APIs for real cost data
- Machine learning-based optimization recommendations
- Historical trend analysis and reporting
- Multi-tenant support with role-based access
- Advanced alerting and notification system
- Integration with container orchestration platforms (Kubernetes, Docker Swarm)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review container logs for error messages
3. Ensure all prerequisites are met
4. Verify Docker and Docker Compose versions are compatible

---

**Version**: 2.0.0  
**Last Updated**: July 2025  
**Compatibility**: Docker 20+, Docker Compose 2.0+

to start fake containers: bash docker_simulation/run_vms.sh 3

to create fake load on containers: docker exec -it vm1 sh
/app # yes > /dev/null &
/app # 
