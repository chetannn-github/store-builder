import CodeBlock from "./CodeBlock";
import { Alert, AlertDescription } from "../../_components/ui/alert";
import { AlertTriangle, CheckCircle, Terminal, Trash2 } from "lucide-react";

const LocalSetup = () => (
  <div className="space-y-8">
    <div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">Local Setup (Minikube)</h2>
      <p className="text-muted-foreground">
        Get the Kubernetes Store Orchestrator running locally using Minikube for development and testing.
      </p>
    </div>

    <div>
      <h3 className="mb-3 text-lg font-semibold text-foreground">Prerequisites</h3>
      <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
        <li>Docker Desktop (running)</li>
        <li>Minikube</li>
        <li>Helm</li>
        <li>Node.js (v18+)</li>
      </ul>
    </div>

    <div className="space-y-6">
      
      {/* STEP 1 */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 1: Start Minikube</h3>
        <p className="mb-3 text-sm text-muted-foreground">Start a local Kubernetes cluster using the Docker driver.</p>
        <CodeBlock code="minikube start --driver=docker" />
      </div>

      {/* STEP 2 */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 2: Verify Cluster Status</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Check if Minikube is running and Kubernetes is ready.
        </p>
        <CodeBlock 
          code={`# 1. Check Minikube Status
minikube status

# 2. Check Kubernetes Nodes
kubectl get nodes`} 
        />
      </div>

      {/* STEP 3 */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 3: Enable Ingress & Tunnel</h3>
        <p className="mb-3 text-sm text-muted-foreground">Enable the Nginx Ingress controller and start the tunnel.</p>
        <CodeBlock code={`minikube addons enable ingress\nminikube tunnel`} />
        <Alert className="mt-3 border-warning/30 bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning">
            Keep the <b>minikube tunnel</b> terminal open! It exposes the services to localhost.
          </AlertDescription>
        </Alert>
      </div>

      {/* STEP 4 */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 4: Clone & Install</h3>
        <CodeBlock
          code={`git clone https://github.com/chetannn-github/store-builder.git
cd store-builder

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install`}
        />
      </div>

      {/* STEP 5 */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 5: Configure Environment</h3>
        <CodeBlock
          code={`MONGO_URI="" 
PORT=5000
NODE_ENV="DEVELOPMENT"
JWT_SECRET="supersecretkey123"
BASE_DOMAIN=localhost`}
          language="env"
        />
      </div>

      {/* STEP 6: FRONTEND & BACKEND SETUP (Updated) */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 6: Run the Application</h3>
        <p className="mb-3 text-sm text-muted-foreground">Open two separate terminals to run the Backend and Frontend.</p>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Terminal 1: Backend API</p>
            <CodeBlock
              code={`cd server
npm start
# Server runs on http://localhost:5000`}
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Terminal 2: Frontend Dashboard</p>
            <CodeBlock
              code={`cd client
npm run dev
# Dashboard runs on http://localhost:3000`}
            />
          </div>
        </div>
      </div>

      {/* STEP 7: CHECK PODS */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 7: Check Running Stores</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Verify that pods are running inside the cluster.
        </p>
        <CodeBlock
          code={`# List all namespaces
kubectl get ns

# Check pods for a specific store
kubectl get pods -n store-xxxxx`}
        />
      </div>

      {/* STEP 8: MANUAL DELETE (New Added) */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 8: Manual Store Deletion</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          If a store gets stuck or you want to manually clean up a namespace.
        </p>
        <CodeBlock
          code={`# 1. Find the namespace name
kubectl get ns

# 2. Force delete the namespace (Deletes all store resources)
kubectl delete ns store-xxxxx`}
        />
        <div className="mt-2 flex items-center gap-2 text-xs text-red-500">
          <Trash2 className="h-3 w-3" />
          <span>Warning: This action is irreversible. All store data will be lost.</span>
        </div>
      </div>

      {/* STEP 9 */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 9: Cleanup & Stop</h3>
        <CodeBlock
          code={`minikube stop   # Stop Cluster
minikube delete # Delete Cluster`}
        />
      </div>

    </div>
  </div>
);

export default LocalSetup;