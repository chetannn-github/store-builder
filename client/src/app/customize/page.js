"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Send,
  Bot,
  User,
  ArrowLeft,
  RotateCw,
  Sparkles,
  Maximize2,
  Minimize2,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";

import { Button } from "../_components/ui/button";
import { Input } from "../_components/ui/input";
import { cn } from "../../lib/utils";

/* ------------------ CONSTANTS ------------------ */

const INITIAL_MESSAGES = [
  {
    id: "1",
    role: "bot",
    content:
      "Hey! 👋 I'm your store customization assistant. Tell me what you'd like to change — colors, layout, products, branding — and I'll help you out!",
    timestamp: new Date(),
  },
];

const BOT_RESPONSES = [
  "Got it! I'm applying those changes to your store now. Check the preview on the right →",
  "Great choice! That's going to look amazing. Updating the preview...",
  "Sure thing! I've noted that customization. What else would you like to tweak?",
  "Perfect! The store is looking better already. Any other changes?",
  "Done! Take a look at the preview. Want me to adjust anything else?",
];

const DEVICE_ORDER = ["desktop", "tablet", "mobile"];

const DEVICE_WIDTH = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

/* ------------------ COMPONENT ------------------ */

export default function Customize() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const storeName = searchParams.get("name") || "Store";

  const [storeUrl, setStoreUrl] = useState(
    searchParams.get("url") || ""
  );

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceView, setDeviceView] = useState("desktop");

  const scrollRef = useRef(null);

  /* ------------------ EFFECTS ------------------ */

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /* ------------------ HELPERS ------------------ */

  const normalizeUrl = (url) => {
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) {
      return "https://" + url;
    }
    return url;
  };

  const cycleDevice = () => {
    const next =
      DEVICE_ORDER[
        (DEVICE_ORDER.indexOf(deviceView) + 1) % DEVICE_ORDER.length
      ];
    setDeviceView(next);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        role: "user",
        content: input.trim(),
        timestamp: new Date(),
      },
    ]);

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "bot",
          content:
            BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  /* ------------------ RENDER ------------------ */

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* ───────── LEFT CHAT ───────── */}
      <div
        className={cn(
          "flex flex-col border-r bg-background transition-all duration-300",
          isFullscreen
            ? "w-0 min-w-0 opacity-0 border-r-0"
            : "w-[420px] min-w-[340px] opacity-100"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Customization Bot</p>
              <p className="text-xs text-muted-foreground">{storeName}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2.5 max-w-[92%]",
                msg.role === "user" && "ml-auto flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  msg.role === "bot"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary"
                )}
              >
                {msg.role === "bot" ? (
                  <Bot className="h-3.5 w-3.5" />
                ) : (
                  <User className="h-3.5 w-3.5" />
                )}
              </div>

              <div
                className={cn(
                  "rounded-2xl px-3.5 py-2.5 text-sm",
                  msg.role === "bot"
                    ? "bg-secondary rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce-dot"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="border-t p-3 flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what to customize..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* ───────── RIGHT PREVIEW ───────── */}
      <div className="flex flex-1 flex-col bg-muted/30">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b px-3 py-2">
          {/* Device toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-7 w-7 overflow-hidden"
            onClick={cycleDevice}
          >
            <span key={deviceView} className="animate-device-icon">
              {deviceView === "desktop" && <Monitor className="h-4 w-4" />}
              {deviceView === "tablet" && <Tablet className="h-4 w-4" />}
              {deviceView === "mobile" && <Smartphone className="h-4 w-4" />}
            </span>
          </Button>

          {/* Editable URL bar */}
          <form
            className="flex flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              setStoreUrl((u) => normalizeUrl(u));
              setIframeKey((k) => k + 1);
            }}
          >
            <Input
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              placeholder="Enter store URL..."
              className="h-7 text-xs font-mono bg-secondary/50"
            />
          </form>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIframeKey((k) => k + 1)}
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen((f) => !f)}
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </Button>
        </div>

        {/* Animated Preview */}
        <div className="flex flex-1 items-center justify-center overflow-hidden">
          <div
            className="h-full transition-[width] duration-300 ease-in-out"
            style={{
              width: DEVICE_WIDTH[deviceView],
              maxWidth: "100%",
            }}
          >
            {storeUrl ? (
              <iframe
                key={iframeKey}
                src={storeUrl}
                className="h-full w-full bg-background rounded-md shadow"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No preview available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-device-icon {
          animation: deviceFade 0.2s ease-out;
        }

        @keyframes deviceFade {
          from {
            opacity: 0;
            transform: scale(0.85) rotate(-8deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        .animate-bounce-dot {
          animation: bounceDot 1.2s infinite ease-in-out;
        }

        @keyframes bounceDot {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
}
