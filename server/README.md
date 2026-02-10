# 🚀 ONLINE STORE BUILDER

Online Store Builder is a platform that provisions **isolated online
stores on Kubernetes**.\
It works seamlessly in both **Local (Minikube)** and **Production (AWS
EC2 + K3s)** environments using a single codebase.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Tech](https://img.shields.io/badge/Stack-Node.js%20%7C%20Kubernetes%20%7C%20Helm-blue)

------------------------------------------------------------------------

## 🌟 What does this platform do?

The platform allows users to create a fully functional online store with
a single request.\
Once a store name is provided, a live domain is automatically generated
and routed to a dedicated Kubernetes namespace.

### Key Highlights

-   **Hybrid Cloud Support**\
    Automatically adapts based on environment:

    -   Local → Minikube + localhost
    -   Production → AWS EC2 + K3s + nip.io domains

-   **Instant Domains using `nip.io`**\
    `store-name.<EC2_PUBLIC_IP>.nip.io`

-   **Strong Isolation**

    -   One Kubernetes namespace per store
    -   CPU & memory limits enforced

-   **Clean Store Deletion**

    -   Helm release removed
    -   Namespace deleted
    -   Persistent volumes cleaned

------------------------------------------------------------------------

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


------------------------------------------------------------------------



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

------------------------------------------------------------------------

## ☁️ Production Deployment (AWS EC2 + K3s)

### Infrastructure Requirements

-   Ubuntu 22.04
-   t3.medium (minimum)

### Security Group Rules

Ports to open: **22, 80, 443, 5000**

------------------------------------------------------------------------

### Step 1: Install K3s

``` bash
curl -sfL https://get.k3s.io | sh -
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
```

------------------------------------------------------------------------

### Step 2: Install Helm & Node.js

``` bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

------------------------------------------------------------------------

### Step 3: Clone Repository

``` bash
git clone https://github.com/chetannn-github/store-builder.git
cd store-builder
cd server && npm install
cd ../client && npm install && npm run build
```

------------------------------------------------------------------------

### Step 4: Environment Variables

``` env
NODE_ENV=production
PORT=5000
MONGO_URI=<MONGO_ATLAS_URI>
JWT_SECRET=<SECRET>
BASE_DOMAIN=<EC2_PUBLIC_IP>.nip.io
```

------------------------------------------------------------------------

### Step 5: Run Backend

``` bash
npm install -g pm2
pm2 start server.js --name orchestrator
pm2 save
pm2 startup
```

------------------------------------------------------------------------

### ✅ Verification

``` bash
kubectl get nodes
kubectl get pods -A
helm version
node -v
pm2 status
curl http://localhost:5000/api/health
```

------------------------------------------------------------------------


## 🧠 Engineering Choices (Simple Explanation)

### Why Helm?
Helm makes it easy to package everything related to a store (service, ingress, database config) together.  
It also allows passing dynamic values like domains and credentials cleanly at runtime.


### Why `nip.io`?
I didn't have a registered domain name. nip.io allowed us to turn our server's IP address into a working website link instantly, so we could build and test the platform without buying a domain.

---

## 🔐 Security

-   Namespace isolation
-   Resource quotas
-   JWT authentication
