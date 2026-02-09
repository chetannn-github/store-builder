# 🚀 ONLINE STORE BUILDER

Online Store Builder is a tool that helps you create and manage **isolated online stores on Kubernetes**. It runs seamlessly on both **Local (Minikube)** and **Production (AWS EC2 + K3s)** environments using a single codebase.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Tech](https://img.shields.io/badge/Stack-Node.js%20%7C%20Kubernetes%20%7C%20Helm-blue)

---

## 🌟 What does this platform do?

It lets you create a fully working online store in just one click. Simply enter a store name, and you instantly get a live link to your new website—no technical setup required.

### Key Highlights

- **Hybrid Cloud Support**  
  The platform automatically understands whether it is running locally or on production and adjusts:
  - Ingress controller (Nginx / Traefik)
  - Domain handling strategy

- **Instant Domains with `nip.io`**  
  - **Production:** Automatically creates domains like  
    `store-name.<SERVER_IP>.nip.io`  
  - **Local:** Uses `localhost` for quick testing  

- **Full Store Isolation**  
  Each store runs in its own **Kubernetes Namespace** with strict **CPU and memory limits**, so one store never affects another.

- **Clean Deletion (No Leftovers)**  
  When a store is deleted:
  - Helm release is removed
  - Namespace is deleted
  - PVCs are cleaned up  
  This prevents disk space leaks over time.

- **Access Control & Limits**  
  - Users can manage only their own stores
  - Store creation is rate-limited (max 3 stores per user)

---

## 🏗️ How the system works

**Flow:**  
`React Dashboard` → `Node.js API` → `Helm Orchestrator` → `Kubernetes Cluster`

1. **Store Request**  
   User requests a new store (example: *“Nike Clone”*).

2. **Validation**  
   Backend checks:
   - User limits
   - Namespace availability

3. **Provisioning**  
   - Creates a new Kubernetes namespace  
   - Applies resource quotas  
   - Runs `helm install` with dynamic values (DB, ingress, domains)

4. **Traffic Routing**  
   Ingress routes traffic to the correct store using the domain name.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- Docker Desktop
- Minikube (for local setup)
- Helm 3
- MongoDB (Local or Atlas)

---

### ⚙️ Environment Configuration

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
NODE_ENV=development      # production on VPS
MONGO_URI=mongodb://...
JWT_SECRET=secure_secret
BASE_DOMAIN=localhost     # <IP>.nip.io on production
```

---

## 💻 Local Setup (Minikube)

Start Kubernetes:

```bash
minikube start --driver=docker
minikube addons enable ingress
```

Expose services:

```bash
minikube tunnel
```

Run the platform:

```bash
# Backend
cd server
npm install
npm start

# Frontend
cd dashboard
npm install
npm run dev
```

---

## ☁️ Production Setup (AWS EC2 + K3s)

Tested on **Ubuntu 22.04 (t3.medium)**.

Install K3s:

```bash
curl -sfL https://get.k3s.io | sh -
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
```

Install tools:

```bash
# Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# PM2
npm install -g pm2
```

Deploy backend:

```bash
pm2 start server.js --name "online-store-builder"
```

Make sure:
- `NODE_ENV=production`
- `BASE_DOMAIN=<YOUR_EC2_IP>.nip.io`

---

## 🧠 Engineering Choices (Simple Explanation)

### Why Helm?
Helm makes it easy to package everything related to a store (service, ingress, database config) together.  
It also allows passing dynamic values like domains and credentials cleanly at runtime.


### Why `nip.io`?
I didn't have a registered domain name. nip.io allowed us to turn our server's IP address into a working website link instantly, so we could build and test the platform without buying a domain.

---

## 🔐 Security Basics

- Namespace-level isolation
- CPU & memory limits
- JWT-based API authentication

---
