import CodeBlock from "./CodeBlock";
import { Alert, AlertDescription } from "../../../_components/ui/alert";
import { Globe, ShieldCheck, Network, Cpu, Server, RefreshCw } from "lucide-react";

const DomainGuide = () => {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Custom Domain Setup (Woocommerce)
        </h2>
        <p className="text-muted-foreground">
          Link your brand domain (e.g., mybrand.com) to our Kubernetes-powered
          infrastructure with automatic SSL and routing.
        </p>
      </div>

      {/* Overview */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            How It Works (High-Level Flow)
          </h3>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>We verify domain ownership using a TXT record.</li>
          <li>Traffic is routed to our Ingress controller using CNAME.</li>
          <li>Kubernetes updates routing rules dynamically.</li>
        </ul>
      </div>

      {/* Step 1 */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">
          Step 1: Verify Domain Ownership
        </h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Add the following TXT record in your domain registrar to prove
          ownership.
        </p>

        <CodeBlock
          code={`Type: TXT
Name: _acme-challenge.domain
Value: e160da2d433,.validation.instaconnector.in`}
          language="DNS Record"
        />
      </div>

      {/* Step 2 */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">
          Step 2: Route Traffic (CNAME Record)
        </h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Point your domain to our platform so traffic flows through our
          Kubernetes Ingress.
        </p>

        <CodeBlock
          code={`Type: CNAME
Name: www
Value: store-123.instaconnector.in`}
          language="DNS Record"
        />
      </div>

      {/* Step 3 */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">
          Step 3: Cloud Provisioning
        </h3>
        <p className="text-sm text-muted-foreground">
          Our backend automatically updates Kubernetes Ingress rules and
          provisions.
        </p>
      </div>

      {/* Step 4 */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">
          Step 4: Application Sync
        </h3>
        <p className="text-sm text-muted-foreground">
          Internal store configuration (WordPress ) is updated so all
          URLs use your new custom domain.
        </p>
      </div>

      {/* DNS Propagation Notice */}
      <Alert className="border-warning/30 bg-warning/5">
        <RefreshCw className="h-4 w-4 text-warning animate-spin-slow" />
        <AlertDescription className="text-warning text-sm">
          DNS propagation may take 5 minutes to 24 hours globally.
        </AlertDescription>
      </Alert>

    </div>
  );
};

export default DomainGuide;
