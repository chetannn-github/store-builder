import CodeBlock from "./CodeBlock";
import { Alert, AlertDescription } from "../../_components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 1: Start Minikube</h3>
        <p className="mb-3 text-sm text-muted-foreground">Start a local Kubernetes cluster using the Docker driver.</p>
        <CodeBlock code="minikube start --driver=docker" />
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 2: Enable Ingress Addon</h3>
        <p className="mb-3 text-sm text-muted-foreground">Enable the Nginx Ingress controller for local routing.</p>
        <CodeBlock code="minikube addons enable ingress" />
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 3: Start Minikube Tunnel</h3>
        <p className="mb-3 text-sm text-muted-foreground">Expose cluster services to your local machine.</p>
        <CodeBlock code="minikube tunnel" />
        <Alert className="mt-3 border-warning/30 bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning">
            Keep this terminal open! The tunnel must remain running for services to be accessible.
          </AlertDescription>
        </Alert>
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 4: Clone & Install</h3>
        <p className="mb-3 text-sm text-muted-foreground">Clone the repository and install dependencies for both the server and dashboard.</p>
        <CodeBlock
          code={`git clone https://github.com/chetannn-github/store-builder.git
cd store-builder

# Install server dependencies
cd server && npm install

# Install dashboard dependencies
cd ../client && npm install`}
        />
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 5: Configure Environment</h3>
        <p className="mb-3 text-sm text-muted-foreground">Create a <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">.env</code> file in the server directory.</p>
        <CodeBlock
          code={`
            MONGO_URI=""  // MONGO ATLAS CONNECTION URI
            PORT=5000
            NODE_ENV="DEVELOPMENT"
            JWT_SECRET="supersecretkey123"
            BASE_DOMAIN=localhost`}
          language="env"
        />
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">Step 6: Run the Application</h3>
        <p className="mb-3 text-sm text-muted-foreground">Start the frontend and backend in separate terminals.</p>
        <CodeBlock
          code={`# Terminal 1 — Frontend
cd client
npm run dev

# Terminal 2 — Backend
cd server
npm start`}
        />
      </div>
    </div>
  </div>
);

export default LocalSetup;
