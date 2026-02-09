const Architecture = () => (
  <div className="space-y-8">
    <div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">Architecture & Usage</h2>
      <p className="text-muted-foreground">
        Understand the system architecture, networking model, and how to use the orchestrator effectively.
      </p>
    </div>

    {/* System Flow */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">System Flow</h3>
      <div className="overflow-x-auto rounded-lg border border-border bg-secondary/30 p-6">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
          <span className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-primary">
            React UI
          </span>
          <span className="text-muted-foreground">→</span>
          <span className="rounded-lg border border-border bg-card px-4 py-2 text-foreground">
            Node.js API
          </span>
          <span className="text-muted-foreground">→</span>
          <span className="rounded-lg border border-border bg-card px-4 py-2 text-foreground">
            Helm Chart
          </span>
          <span className="text-muted-foreground">→</span>
          <span className="rounded-lg border border-border bg-card px-4 py-2 text-foreground">
            K8s Namespace
          </span>
          <span className="text-muted-foreground">→</span>
          <span className="rounded-lg border border-success/30 bg-success/10 px-4 py-2 text-success">
            WordPress Pod
          </span>
        </div>
      </div>
    </div>

    {/* Networking */}
    <div>
      <h3 className="mb-3 text-lg font-semibold text-foreground">Networking</h3>
      <div className="rounded-lg border border-border bg-card p-5">
        <p className="mb-3 text-sm text-muted-foreground">
          The orchestrator uses <strong className="text-foreground">nip.io</strong> for automatic wildcard DNS resolution.
          This eliminates the need for manual DNS configuration.
        </p>
        <div className="rounded-md bg-secondary/50 p-3 font-mono text-sm">
          <span className="text-muted-foreground">{"<store-slug>"}</span>
          <span className="text-foreground">.{"<base-ip>"}.nip.io</span>
          <span className="text-muted-foreground"> → resolves to </span>
          <span className="text-primary">{"<base-ip>"}</span>
        </div>
      </div>
    </div>

    {/* Ingress */}
    <div>
      <h3 className="mb-3 text-lg font-semibold text-foreground">Ingress Controllers</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h4 className="mb-2 font-semibold text-foreground">Local (Minikube)</h4>
          <p className="text-sm text-muted-foreground">
            Uses the <strong className="text-foreground">Nginx Ingress Controller</strong> enabled
            via Minikube addons. Routes traffic based on host headers.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h4 className="mb-2 font-semibold text-foreground">Production (EC2)</h4>
          <p className="text-sm text-muted-foreground">
            Uses <strong className="text-foreground">Traefik</strong>, bundled with K3s by default.
            Automatically discovers Ingress resources and routes traffic.
          </p>
        </div>
      </div>
    </div>

    {/* Persistence */}
    <div>
      <h3 className="mb-3 text-lg font-semibold text-foreground">Persistence</h3>
      <div className="rounded-lg border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Each WooCommerce store uses <strong className="text-foreground">Persistent Volume Claims (PVCs)</strong> to
          ensure database data survives pod restarts and redeployments. This guarantees data durability
          across the lifecycle of each store instance.
        </p>
      </div>
    </div>

    {/* Usage Workflow */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">Usage Workflow</h3>
      <div className="space-y-3">
        {[
          { step: "1", title: "Create Store", desc: 'Click "Create New Store" in the Dashboard and fill in the store details.' },
          { step: "2", title: 'Wait for "READY"', desc: "The orchestrator provisions a Kubernetes namespace, deploys the Helm chart, and starts the WordPress pod." },
          { step: "3", title: "Access Store", desc: "Once the status turns READY, click the store URL to access your WooCommerce instance." },
          { step: "4", title: "Delete / Teardown", desc: "Click the delete icon to completely tear down all Kubernetes resources for that store." },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {item.step}
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{item.title}</h4>
              <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Architecture;
