"use client"
import { useState } from "react";
import { BookOpen, Server, Layers } from "lucide-react";
import { cn } from "../../../lib/utils";
import LocalSetup from "./_components/LocalSetup";
import ProductionDeploy from "./_components/ProductionDeploy";
import Architecture from "./_components/Architecture";

const sections = [
  { id: "local", label: "Local Setup", icon: BookOpen },
  { id: "production", label: "Production (EC2)", icon: Server },
  { id: "architecture", label: "Architecture", icon: Layers },
];

const Documentation = () => {
  const [activeSection, setActiveSection] = useState("local");

  const renderContent = () => {
    switch (activeSection) {
      case "local":
        return <LocalSetup />;
      case "production":
        return <ProductionDeploy />;
      case "architecture":
        return <Architecture />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Documentation
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you need to set up, deploy, and understand the Kubernetes Store Orchestrator.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <nav className="w-full shrink-0 lg:w-56">
          <div className="sticky top-24 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  activeSection === section.id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <section.icon className="h-4 w-4 shrink-0" />
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main className="min-w-0 flex-1 rounded-lg border border-border bg-card/30 p-6 sm:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Documentation;
