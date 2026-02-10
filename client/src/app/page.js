"use client"
import { Shield, Globe, Cloud, ArrowRight, Terminal } from "lucide-react";
import { Button } from "./_components/ui/button";
import { Card, CardContent } from "./_components/ui/card";
import Link from "next/link";
import { useAuth } from "./_hooks/useAuth";


const features = [
  {
    icon: Shield,
    title: "Namespace Isolation",
    description:
      "Each store runs in its own Kubernetes namespace with dedicated resources, ensuring complete security and isolation between tenants.",
  },
  {
    icon: Globe,
    title: "Instant DNS",
    description:
      "Automatic wildcard DNS via nip.io — every store gets a unique, accessible URL instantly without manual DNS configuration.",
  },
  {
    icon: Cloud,
    title: "Hybrid Deploy",
    description:
      "Seamlessly switch between local Minikube development and production AWS EC2 deployments with a single environment variable.",
  },
];

const Index = () => {
  const {isLoading} = useAuth();

  if(isLoading) return null;
    return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
            <Terminal className="h-3.5 w-3.5" />
            <span>DevOps Internship Project</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Launch WooCommerce Stores{" "}
            <span className="text-primary">in Seconds</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Hybrid Cloud Orchestration using Kubernetes, Helm, and Node.js.
            Deploy locally on Minikube or globally on AWS EC2.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2 px-8 text-base font-semibold">
              <Link href="/dashboard">
                Launch Console
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 px-8 text-base">
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border bg-card/30 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Built for Production-Grade Deployments
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border bg-card transition-colors hover:border-primary/30 hover:bg-accent/30"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8">
        <p className="text-center text-sm text-muted-foreground">
          K8s Store Orchestrator — DevOps Internship Project
        </p>
      </footer>
    </div>
  );
};

export default Index;
