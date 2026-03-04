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
import Loader from "../_components/Loader";
import api from "@/lib/api";


const INITIAL_MESSAGES = [
  {
    id: "1",
    role: "bot",
    content:
      "Hey! 👋 I'm your store manager assistant. How can I help you bro ? ",
    timestamp: new Date(),
  },
];

 const normalizeUrl = (url) => {
    if (!url) return "";
    if (url.match(/\/wp-admin$/i)) {
      url += "/";
    }
    if (!/^https?:\/\//i.test(url)) {
      return "https://" + url;
    }
    
    return url;
  };
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
  const storeId = searchParams.get("storeId");
  
  const [storeUrl, setStoreUrl] = useState(
    normalizeUrl(searchParams.get("url") || "")
  );

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceView, setDeviceView] = useState("desktop");
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [suggestedActions, setSuggestedActions] = useState([]);
  const [loadingActions, setLoadingActions] = useState(true);
  const [loadingChat, setLoadingChat] = useState(true);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!storeId) {
        setLoadingChat(false);
        return;
      }
      setLoadingChat(true);
      
      
      try {
        const token = localStorage.getItem("jwt");
        const json = await api.get(`/ai/chat/${storeId}`,token);

        if (json.success && json.data && json.data.length > 0) {
          const formattedHistory = json.data.map((msg, idx) => ({
            id: msg._id || String(Date.now() + idx),
            role: msg.role === "assistant" ? "bot" : "user",
            content: msg.content,
            meta : msg.meta,
            timestamp: new Date(msg.timestamp || Date.now()),
          }));
          
          setMessages(formattedHistory);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoadingChat(false);
      }
    };

    const fetchSuggestion = async () => {
      if (!storeId) return;
      setLoadingActions(true);
      
      try {
        const token = localStorage.getItem("jwt");
        const json = await api.get(`/ai/suggestions/${storeId}`,token);

        if (json.success && json.data && json.data.length > 0) {
          setSuggestedActions(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
      setLoadingActions(false);
    }

    fetchChatHistory();
    fetchSuggestion();
  }, [storeId]);

  useEffect(() => {
    setIsIframeLoading(true);
  }, [iframeKey, storeUrl]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /* ------------------ HELPERS ------------------ */



  const cycleDevice = () => {
    const next =
      DEVICE_ORDER[
        (DEVICE_ORDER.indexOf(deviceView) + 1) % DEVICE_ORDER.length
      ];
    setDeviceView(next);
  };

 const handleSend = async () => {
    if (!input.trim() || !storeId) return; 
    const userText = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        role: "user",
        content: userText,
        timestamp: new Date(),
      },
    ]);

    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("jwt");
    
      const json = await api.post('/ai/chat', 
        { message: userText, storeId },
        token
      );

      if (json.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            role: "bot",
            content: json.structured?.message,
            meta : {...json?.structured } ,
            timestamp: new Date(),
          },
        ]);

        if (json.toolExecuted) {
          console.log(`[Action Triggered]: ${json.toolName} - Refreshing store preview...`);
          setIframeKey((prevKey) => prevKey + 1);
          setStoreUrl(normalizeUrl(json?.structured?.link));
        }
        
      } else {
        throw new Error(json.error || "Failed to process request");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 2),
          role: "bot",
          content: "Sorry bhai, network issue ho gaya. Try again!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };


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
        {loadingChat ? (
          <div className="flex h-full items-center justify-center">
            <Loader label="Loading chat..." />
          </div>
        ) :
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 hide-scrollbar"
          >
           {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2.5 max-w-[92%]",
                msg.role === "user" && "ml-auto flex-row-reverse"
              )}
            >
              {/* Avatar */}
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

              {/* Message Bubble */}
              <div
                className={cn(
                  "rounded-2xl px-3.5 py-2.5 text-sm space-y-2",
                  msg.role === "bot"
                    ? "bg-secondary rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                )}
              >
                {/* Text Content */}
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {msg.meta?.link && (
                  <Button
                    onClick={() => {
                      const normalized = normalizeUrl(msg.meta.link);
                      setStoreUrl(normalized);
                      setIframeKey((k) => k + 1);
                    }}
                    className="inline-block text-xs font-medium px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                  >
                    {msg.meta.linkLabel || "View"}
                  </Button>
                )}
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
        }
        <div className="border-t border-border px-3 pt-2.5 pb-1 overflow-y-auto hide-scrollbar ">
          {loadingActions ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-28 shrink-0 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {suggestedActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-lg text-xs h-8 border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                  onClick={() => {
                    setInput(action.prompt);
                    inputRef.current?.focus();
                  }}
                >
                  {action.title}
                </Button>
              ))}
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
            className="h-full transition-[width] duration-300 ease-in-out relative"
            style={{
              width: DEVICE_WIDTH[deviceView],
              maxWidth: "100%",
            }}
          >
            {storeUrl ? (
              <>
                {isIframeLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
                      <Loader  label={"Loading Store..."}/>
                    </div>
                  )}
                <iframe
                  key={iframeKey}
                  src={storeUrl}
                  onLoad={() => setIsIframeLoading(false)}
                  className="h-full w-full bg-background rounded-md shadow"
                />
              </>
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
