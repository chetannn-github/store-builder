const Architecture = () => (
  <div className="space-y-10">
    {/* Heading */}
    <div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">
        Architecture & System Design
      </h2>
      <p className="text-muted-foreground">
        This section explains how the platform works internally and from
        user perspective.
      </p>
    </div>

    {/* User Perspective */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        1️⃣ User Flow
      </h3>

      <div className="space-y-3 text-sm text-muted-foreground">
        <p>User opens:</p>

        <div className="rounded-md bg-secondary/50 p-3 font-mono">
          https://store.instaconnector.in
        </div>

        <p>User clicks <b>Create Store</b>.</p>

        <p>
          A user can create maximum <b>3 stores</b>.  
          If limit is reached, backend blocks new creation.
        </p>

        <p>
          After clicking create, store status becomes:
        </p>

        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>PROVISIONING</li>
          <li>READY</li>
          <li>FAILED (if error happens)</li>
        </ul>
      </div>
    </div>

    {/* Async Creation */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        2️⃣ Asynchronous Store Creation
      </h3>

      <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground space-y-2">
        <p>
          Store creation is asynchronous.
        </p>

        <p>
          Backend does NOT wait for Kubernetes to finish.
          It immediately returns a response to frontend.
        </p>

        <p>
          Store status is saved in database as <b>CREATING</b>.
        </p>

        <p>
          Backend runs Helm deployment in background.
        </p>
      </div>
    </div>

    {/* Polling */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        3️⃣ Frontend Polling System
      </h3>

      <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground space-y-2">
        <p>
          Frontend polls backend API every few seconds.
        </p>

        <p>Example:</p>

        <div className="rounded-md bg-secondary/50 p-3 font-mono">
          GET /api/stores
        </div>

        <p>
          When Kubernetes pod becomes ready,
          backend updates store status to <b>READY</b>.
        </p>

        <p>
          Polling automatically updates UI.
        </p>
      </div>
    </div>

    {/* URL Structure */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        4️⃣ URL Structure
      </h3>

      <div className="space-y-4 text-sm text-muted-foreground">

        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="font-semibold text-foreground mb-2">
            WordPress Store (slug: papa)
          </h4>

          <div className="font-mono space-y-1">
            <div>https://papa.instaconnector.in</div>
            <div>https://papa.instaconnector.in/wp-admin</div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="font-semibold text-foreground mb-2">
            Medusa Store (slug: papa)
          </h4>

          <div className="font-mono space-y-1">
            <div>Storefront → https://papa.instaconnector.in</div>
            <div>API → https://api-papa.instaconnector.in</div>
            <div>Admin → https://admin-papa.instaconnector.in/app</div>
          </div>
        </div>

      </div>
    </div>

    {/* Traffic Flow */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        5️⃣ Production Traffic Flow
      </h3>

      <div className="overflow-x-auto rounded-lg border border-border bg-secondary/30 p-6">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
          <span className="rounded-lg bg-primary/10 px-4 py-2 text-primary">
            User
          </span>
          <span>→</span>
          <span className="rounded-lg bg-card px-4 py-2">
            Nginx (Server)
          </span>
          <span>→</span>
          <span className="rounded-lg bg-card px-4 py-2">
            Ingress-Nginx
          </span>
          <span>→</span>
          <span className="rounded-lg bg-card px-4 py-2">
            K3s Service
          </span>
          <span>→</span>
          <span className="rounded-lg bg-success/10 px-4 py-2 text-success">
            Store Pod
          </span>
        </div>
      </div>
    </div>

    {/* Data Isolation */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        6️⃣ Store Isolation & Data Safety
      </h3>

      <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground space-y-2">
        <p>Each store runs in its own Kubernetes namespace.</p>
        <p>Each store has its own Persistent Volume.</p>
        <p>If pod restarts, data remains safe.</p>
        <p>Stores are isolated from each other.</p>
      </div>
    </div>

    {/* Deletion */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        7️⃣ Store Deletion
      </h3>

      <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground space-y-2">
        <p>
          When user clicks delete, backend runs Helm uninstall.
        </p>
        <p>
          All resources (pod, service, ingress, storage) are removed.
        </p>
      </div>
    </div>
  </div>
);

export default Architecture;
