import { Box } from "lucide-react";
import { cn } from "../../lib/utils";

const sizeMap = {
  sm: { ring: "h-10 w-10", icon: "h-4 w-4", glow: "h-16 w-16" },
  md: { ring: "h-16 w-16", icon: "h-6 w-6", glow: "h-24 w-24" },
  lg: { ring: "h-20 w-20", icon: "h-8 w-8", glow: "h-32 w-32" },
};

const Loader = ({
  size = "md",
  label,
  fullScreen = false,
  className,
}) => {
  const s = sizeMap[size];

  const spinner = (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <div className="relative flex items-center justify-center">
        {/* Background glow */}
        <div
          className={cn(
            "absolute rounded-full bg-primary/10 blur-2xl",
            s.glow
          )}
          style={{ animation: "loaderPulse 2s ease-in-out infinite" }}
        />

        {/* Outer spinning ring */}
        <div
          className={cn(
            "absolute rounded-full border-2 border-transparent border-t-primary/60 border-r-primary/20",
            s.ring
          )}
          style={{ animation: "loaderSpin 1.5s linear infinite" }}
        />

        {/* Inner reverse spinning ring */}
        <div
          className={cn(
            "absolute rounded-full border-2 border-transparent border-b-primary/40 border-l-primary/10",
            s.ring
          )}
          style={{
            animation: "loaderSpin 2s linear infinite reverse",
            transform: "scale(0.75)",
          }}
        />

        {/* Center icon */}
        <Box
          className={cn(
            "text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]",
            s.icon
          )}
          style={{ animation: "loaderFloat 2s ease-in-out infinite" }}
        />
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary/60"
            style={{
              animation: `loaderDot 1.2s ease-in-out ${i * 0.12}s infinite`,
            }}
          />
        ))}
      </div>

      {label && (
        <p
          className="text-sm font-medium tracking-wide text-muted-foreground"
          style={{ animation: "loaderFadeText 2s ease-in-out infinite" }}
        >
          {label}
        </p>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes loaderSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes loaderPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
        @keyframes loaderFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes loaderDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes loaderFadeText {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;
