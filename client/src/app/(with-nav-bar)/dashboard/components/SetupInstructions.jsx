"use client";

import { Settings, KeyRound, ChevronRight } from "lucide-react";
import { Button } from "../../../_components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../_components/ui/dialog";
import { Input } from "../../../_components/ui/input";
import { Label } from "../../../_components/ui/label";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export const SetupInstructions = ({ store }) => {
  const [expanded, setExpanded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [publishableKey, setPublishableKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


 const handleSetup = async () => {``
  if (!publishableKey.trim()) return;

  try {
    setLoading(true);
    setError("");

    const payload = {
      storeId: store._id,
      publishableKey 
    }
    const token = localStorage.getItem('jwt');  
    const res = await api.post("/stores/deploy-medusa-storefront",payload, token);

    if (!res.success) {
      throw new Error(res?.message || "Setup failed");
    }

    toast.success(res.message);

    console.log("Setup success:", res);
    setShowDialog(false);
    setPublishableKey("");
  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="border-t border-border bg-primary/5 px-6 py-4 cursor-pointer select-none"
      onClick={() => setExpanded((prev) => !prev)}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">
            Storefront Setup Required
          </span>
        </div>

        <ChevronRight
          className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
            expanded ? "rotate-90" : ""
          }`}
        />
      </div>

      {/* EXPANDABLE CONTENT */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">1. Open your Admin Panel</p>
            {store.adminUrl && (
              <a
                href={store.adminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline text-xs"
                onClick={(e) => e.stopPropagation()} // prevent collapse on link click
              >
                {store.adminUrl}
              </a>
            )}
          </div>

          <div>
            <p className="font-medium">2. Copy Publishable Key</p>
            <p className="text-xs text-muted-foreground">
              Settings → Developer → Publishable Key
            </p>
          </div>

          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // prevent collapse
              setShowDialog(true);
            }}
          >
            <KeyRound className="h-3.5 w-3.5 mr-1" />
            Setup Storefront
          </Button>
        </div>
      </div>

      {/* DIALOG */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Enter Publishable Key</DialogTitle>
            <DialogDescription>
              Paste your publishable key below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Publishable Key</Label>
            <Input
              value={publishableKey}
              onChange={(e) => setPublishableKey(e.target.value)}
              placeholder="pk_live_xxxxxxxxx"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetup} disabled={loading}>
              {loading ? "Setting up..." : "Setup"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};