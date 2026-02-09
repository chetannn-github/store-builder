import CodeBlock from "./CodeBlock";

const ProductionDeploy = () => (
  <div className="space-y-8">
    <div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">Production Deployment (AWS EC2)</h2>
      <p className="text-muted-foreground">
        Deploy the orchestrator to a production environment on AWS EC2 using K3s, a lightweight Kubernetes distribution.
      </p>
    </div>

    <div>
      <h3 className="mb-3 text-lg font-semibold text-foreground">Infrastructure Requirements</h3>
      <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
        <li>AWS EC2 Instance — <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">Ubuntu 22.04</code></li>
        <li>Instance Type — <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">t3.medium</code> (minimum)</li>
      </ul>
    </div>

    <div>
      <h3 className="mb-3 text-lg font-semibold text-foreground">Security Groups</h3>
      <p className="mb-2 text-sm text-muted-foreground">Open the following ports in your EC2 Security Group:</p>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-muted-foreground">Port</th>
              <th className="px-4 py-2 text-left font-medium text-muted-foreground">Protocol</th>
              <th className="px-4 py-2 text-left font-medium text-muted-foreground">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr><td className="px-4 py-2 font-mono text-foreground">22</td><td className="px-4 py-2 text-muted-foreground">TCP</td><td className="px-4 py-2 text-muted-foreground">SSH Access</td></tr>
            <tr><td className="px-4 py-2 font-mono text-foreground">80</td><td className="px-4 py-2 text-muted-foreground">TCP</td><td className="px-4 py-2 text-muted-foreground">HTTP Traffic</td></tr>
            <tr><td className="px-4 py-2 font-mono text-foreground">443</td><td className="px-4 py-2 text-muted-foreground">TCP</td><td className="px-4 py-2 text-muted-foreground">HTTPS Traffic</td></tr>
            <tr><td className="px-4 py-2 font-mono text-foreground">5000</td><td className="px-4 py-2 text-muted-foreground">TCP</td><td className="px-4 py-2 text-muted-foreground">API Server</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 1: Install K3s</h3>
        <p className="mb-3 text-sm text-muted-foreground">Install the lightweight Kubernetes distribution on your EC2 instance.</p>
        <CodeBlock
          code={`curl -sfL https://get.k3s.io | sh -

# Fix kubeconfig permissions
sudo chmod 644 /etc/rancher/k3s/k3s.yaml`}
        />
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 2: Install Helm & Node.js</h3>
        <p className="mb-3 text-sm text-muted-foreground">Set up the package manager for Kubernetes and the Node.js runtime.</p>
        <CodeBlock
          code={`# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Install Node.js v18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs`}
        />
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 3: Clone & Install</h3>
        <p className="mb-3 text-sm text-muted-foreground">Clone the project repository and install dependencies.</p>
        <CodeBlock
          code={`git clone https://github.com/chetannn-github/store-builder.git
cd store-builder

cd server && npm install
cd ../client && npm install && npm run build`}
        />
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 4: Configure Environment</h3>
        <p className="mb-3 text-sm text-muted-foreground">Set up the production environment variables.</p>
        <CodeBlock
          code={`NODE_ENV=production
             MONGO_URI="" // MONGO ATLAS CONNECTION URI
            PORT=5000
            
            JWT_SECRET="supersecretkey123"
BASE_DOMAIN=<YOUR_EC2_IP>.nip.io`}
          language="env"
        />
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 5: Run with PM2</h3>
        <p className="mb-3 text-sm text-muted-foreground">Use PM2 to keep the server running as a background process.</p>
        <CodeBlock
          code={`# Install PM2 globally
npm install -g pm2

# Start the orchestrator server
pm2 start server.js --name "orchestrator"

# Save PM2 process list & enable startup
pm2 save
pm2 startup`}
        />
      </div>
    </div>
  </div>
);

export default ProductionDeploy;
