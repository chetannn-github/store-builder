import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "../../_components/ui/button";
import { cn } from "../../../lib/utils";

const CodeBlock = ({ code, language = "bash", className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div
      className={cn(
        "group relative rounded-lg border border-border bg-[hsl(0,0%,2%)]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/50 bg-[hsl(0,0%,3%)] px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          {language}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-success" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </Button>
      </div>

      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-sm text-foreground/90">
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
