
#  Auto Store Builder

Auto Store Builder is a fully automated e-commerce store provisioning platform built using:

- Docker
- Kubernetes (Minikube / K3s)
- Helm
- Nginx Ingress
- Node.js (Backend)
- Next.js (Frontend)

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Tech](https://img.shields.io/badge/Stack-Node.js%20%7C%20Kubernetes%20%7C%20Helm-blue)

Users can create two types of stores:

1. WordPress (WooCommerce)
2. Medusa JS (Headless Commerce)

---

# 🏗 Store Creation (How It Works)

When a user clicks **"Create Store"**, the system automatically:

1. Executes a Helm command from the backend
2. Creates Kubernetes resources (Pod, Service, Ingress)
3. Maps domain dynamically
4. Generates admin credentials
5. Makes the store live

No manual DevOps work required.

---

# 🏪 Store Types

## 1️⃣ WordPress (WooCommerce)

- WooCommerce plugin pre-installed in Docker image
- Admin credentials auto-generated
- Ready-to-use after deployment

Example (slug: `papa`):

Customer:
https://papa.instaconnector.in

Admin:
https://papa.instaconnector.in/wp-admin

---

## 2️⃣ Medusa JS (Headless Store)

Deployment Flow:

1. Backend Admin deployed
2. Admin credentials auto-created
3. Publishable key generated
4. Frontend connected via publishable key

Example (slug: `papa`):

API:
https://api-papa.instaconnector.in

Admin:
https://admin-papa.instaconnector.in/app

Storefront:
https://papa.instaconnector.in

---
---

# 🖥 1️⃣ Local Deployment (Minikube)

Used for development and testing.

## Prerequisites

```bash
docker --version
node -v
npm -v
kubectl version --client
minikube version
```

---

## Start Minikube

```bash
minikube start --driver=docker
minikube addons enable ingress
```

Verify:

```bash
kubectl get nodes
kubectl get pods -A
```

---

## Enable Tunnel

```bash
minikube tunnel
```

---

## Install Helm

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version
```

---

## Run Backend

```bash
cd server
npm install
npm start
```

Test:

```bash
curl http://localhost:5000
```

---

## Run Frontend

```bash
cd client
npm install
npm run dev
```

Open:

http://localhost:3000

---

## Deploy Store Locally

```bash
helm install papa ./charts/store --set ingress.host=papa.local
```

Check:

```bash
kubectl get pods
kubectl get ingress
```

---

## Local Debugging

```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
minikube dashboard
```

---
---

# ☁️ 2️⃣ Production Deployment (Azure VM + K3s)

Production runs on a single Azure VM.

Components:

- Next.js Frontend
- Node.js Backend
- K3s (Kubernetes)
- Nginx (Reverse Proxy)
- Ingress-Nginx
- Helm

---

## Step 1: VM Preparation

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git nginx net-tools
```

---

## Step 2: Install Node.js & PM2

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

Start apps:

```bash
pm2 start npm --name "backend" -- start
pm2 start npm --name "frontend" -- start
pm2 save
pm2 startup
```

---

## Step 3: Install K3s

```bash
curl -sfL https://get.k3s.io | sh -s - --disable traefik
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get nodes
```

---

## Step 4: Install Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
kubectl get pods -n ingress-nginx
```

---

## Step 5: Install Helm

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version
```

---

## Step 6: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/[your-site-domain]
sudo ln -s /etc/nginx/sites-available/[your-site-domain] /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 7: Setup SSL

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d instaconnector.in
sudo certbot certonly --manual --preferred-challenges dns -d "*.instaconnector.in"
```

---



## Azure Firewall Rules

Allow:

- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)

---



# ⚙️ Automation Summary

The platform automatically provisions isolated container-based e-commerce stores using Kubernetes and Helm, with dynamic domain routing via Nginx Ingress.
