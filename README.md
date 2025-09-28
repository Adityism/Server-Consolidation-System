# 🚀 Server Consolidation Optimization Dashboard

**Developed by Aditya Goyal**

A full-stack, real-time dashboard for simulating, monitoring, and optimizing 250+ Docker containers. Reduce infrastructure costs, visualize live metrics, and get actionable optimization suggestions—all in a beautiful React UI.

---

## 🖥️ Features

- **Simulate & Monitor 250+ Containers:** Instantly spin up virtualized containers and track their live CPU/memory usage.
- **Real-Time Optimization:** Get AI-driven suggestions to stop or consolidate idle containers, with projected cost savings in INR.
- **Interactive Dashboard:** React + Vite frontend with modern UI, live charts, and actionable cards.
- **Prometheus & Grafana Integration:** Advanced metrics collection and visualization.
- **One-Click Actions:** Start/stop containers directly from the dashboard.
- **Cost Analytics:** See hourly, daily, and monthly savings for every optimization.
- **Persistent Tracking:** MongoDB-backed APIs for container state and history.
- **Deployed on AWS EC2:** Easily portable with Docker Compose.

---

## 🏗️ Architecture

- **Frontend:** React, Vite, Tailwind, Radix UI, Recharts
- **Backend:** Node.js, Express, Dockerode, MongoDB
- **Monitoring:** Prometheus, cAdvisor
- **Visualization:** Grafana
- **Orchestration:** Docker Compose

---

## 🚦 Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/your-repo/server-consolidation-system.git
cd server-consolidation-system
```

### 2. Build & Launch

```bash
docker-compose up --build -d
```

Or build/run manually:

```bash
docker build -t server-consolidation-backend ./backend
docker build -t server-consolidation-frontend ./frontend
docker run -d --name backend -p 3001:3001 -v /var/run/docker.sock:/var/run/docker.sock server-consolidation-backend
docker run -d --name frontend -p 5173:80 server-consolidation-frontend
```

### 3. Access the Dashboard

- **Main UI:** [http://localhost:5173](http://localhost:5173)
- **API:** [http://localhost:3001/api](http://localhost:3001/api)
- **Prometheus:** [http://localhost:9090](http://localhost:9090)
- **Grafana:** [http://localhost:3000](http://localhost:3000) (admin/admin)

### 4. Simulate Containers

```bash
bash docker_simulation/run_vms.sh 10   # Start 10 fake VMs
```

---

## 🔐 Login

- **Username:** `admin`
- **Password:** `admin`

---

## 📊 Dashboard Highlights

- **Total, Running, and Idle Containers** at a glance
- **Live Resource Charts** (CPU/Memory per container)
- **Optimization Suggestions** with one-click stop
- **Projected Cost Savings** (hourly/daily/monthly, in ₹)
- **Container Management**: Start/Stop containers instantly

---

## 💸 Cost Model

- **Base:** ₹2.5/hr per container
- **CPU:** ₹0.05 per %/hr
- **Memory:** ₹0.03 per %/hr
- **Idle Overhead:** ₹1.2/hr (if CPU & Mem < 10%)

---

## 🧠 Optimization Logic

- **High Priority:** CPU < 5% & Mem < 5% (Stop Now)
- **Medium:** CPU < 10% & Mem < 10% (Optimization Suggested)
- **Low:** CPU < 15% & Mem < 15% (Monitor)

---

## 🛠️ Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🧩 API Endpoints

- `GET /api/containers` — List all containers with stats
- `GET /api/containers/idle` — List containers flagged for optimization
- `POST /api/containers/:id/start` — Start a container
- `POST /api/containers/:id/stop` — Stop a container
- `GET /api/optimization/suggestions` — Get optimization & savings
- `GET /api/health` — API health check

---

## 📈 Monitoring Stack

- **Prometheus:** Collects container metrics from cAdvisor
- **Grafana:** Visualizes metrics (pre-configured dashboards)
- **cAdvisor:** Exposes Docker container stats

---

## 🧪 Simulate Load

```bash
docker exec -it vm1 sh
# Inside container:
yes > /dev/null &
```

---

## 🛡️ Security Notes

- Demo credentials; use secure auth in production
- Restrict Docker socket access in prod
- Add HTTPS and session management for real deployments

---

## 🧭 Troubleshooting

- **Docker Permission:**  
  `sudo usermod -aG docker $USER && sudo systemctl restart docker`
- **Port Conflicts:**  
  Ensure 3001, 5173, 3000, 9090, 8080 are free
- **Stats Not Showing:**  
  Check Docker socket mount and backend logs
- **Frontend Not Loading:**  
  Check container status and backend health

---

## 🚀 Future Enhancements

- Cloud API integration for real cost data
- ML-based optimization
- Historical analytics & reporting
- Multi-tenant & RBAC
- Advanced alerting/notifications
- Kubernetes/Swarm support

---

## 📝 License

MIT

---

**Developed by Aditya Goyal**  
*Version: 2.0.0 — Last updated: September 2025*

---
