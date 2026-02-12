import CodeBlock from "./CodeBlock";

const ProductionDeploy = () => (
  <div className="space-y-8">
    <div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">
        Production Deployment (VM + K3s + Nginx + SSL)
      </h2>
      <p className="text-muted-foreground">
        Deploy Auto Store Builder on a production VM using K3s (without Traefik),
        Ingress-Nginx, system Nginx reverse proxy, and Let's Encrypt SSL.
      </p>
    </div>

    {/* Infrastructure */}
    <div>
      <h3 className="mb-3 text-lg font-semibold text-foreground">
        Infrastructure Requirements
      </h3>
      <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
        <li>Ubuntu 22.04 VM (Azure / AWS)</li>
        <li>Minimum 2 vCPU, 4GB RAM</li>
        <li>Domain pointed to VM public IP</li>
      </ul>
    </div>

    {/* Firewall */}
    <div>
      <h3 className="mb-3 text-lg font-semibold text-foreground">
        Open Firewall / Security Group Ports
      </h3>

      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
        <li>22 → SSH</li>
        <li>80 → HTTP</li>
        <li>443 → HTTPS</li>
      </ul>
    </div>

    {/* Step 1 */}
    <div>
      <h3 className="mb-2 text-base font-semibold text-foreground">
        Step 1: Install K3s (Disable Traefik)
      </h3>

      <CodeBlock
        code={`curl -sfL https://get.k3s.io | sh -s - --disable traefik

sudo chmod 644 /etc/rancher/k3s/k3s.yaml
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl get nodes`}
      />
    </div>

    {/* Step 2 */}
    <div>
      <h3 className="mb-2 text-base font-semibold text-foreground">
        Step 2: Install Ingress-Nginx Controller
      </h3>

      <CodeBlock
        code={`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

kubectl get pods -n ingress-nginx`}
      />
    </div>

    {/* Step 3 */}
    <div>
      <h3 className="mb-2 text-base font-semibold text-foreground">
        Step 3: Install Node.js & PM2
      </h3>

      <CodeBlock
        code={`curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2`}
      />
    </div>

    {/* Step 4 */}
    <div>
      <h3 className="mb-2 text-base font-semibold text-foreground">
        Step 4: Install Nginx (System Reverse Proxy)
      </h3>

      <CodeBlock
        code={`sudo apt install -y nginx

sudo systemctl enable nginx
sudo systemctl start nginx`}
      />
    </div>

    {/* Step 5 */}
    <div>
      <h3 className="mb-2 text-base font-semibold text-foreground">
        Step 5: Configure Nginx Reverse Proxy
      </h3>

      <CodeBlock
        code={`sudo nano /etc/nginx/sites-available/instaconnector.in

# After configuration
sudo ln -s /etc/nginx/sites-available/instaconnector.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx`}
      />
    </div>

    {/* Step 6 */}
    <div>
      <h3 className="mb-2 text-base font-semibold text-foreground">
        Step 6: Setup SSL (Certbot)
      </h3>

      <CodeBlock
        code={`sudo apt install -y certbot python3-certbot-nginx

# Main domain SSL
sudo certbot --nginx -d instaconnector.in

# Wildcard SSL
sudo certbot certonly --manual --preferred-challenges dns -d "*.instaconnector.in"`}
      />
    </div>

    {/* Step 7 */}
    <div>
      <h3 className="mb-2 text-base font-semibold text-foreground">
        Step 7: Configure Production Environment
      </h3>

      <CodeBlock
        language="env"
        code={`NODE_ENV=production
MONGO_URI=<MONGO_ATLAS_URI>
JWT_SECRET=<STRONG_SECRET>
BASE_DOMAIN=instaconnector.in`}
      />
    </div>

    {/* Verification */}
    <div>
      <h3 className="mb-2 text-base font-semibold text-foreground">
        Verification
      </h3>

      <CodeBlock
        code={`kubectl get pods -A
kubectl get ingress

pm2 status

curl https://instaconnector.in/api/health`}
      />
    </div>
  </div>
);

export default ProductionDeploy;
