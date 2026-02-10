"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../../_components/ui/button";
import { Input } from "../../_components/ui/input";
import { Label } from "../../_components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../_components/ui/dialog";
import { useToast } from "../../_hooks/useToast";
import api from "@/lib/api";

const CreateStoreModal = ({ open, onOpenChange, onCreated }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "woocommerce", // Default value
    adminEmail: "admin@example.com",
    adminPassword: "password123",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const createStore = async(payload) => {
    const token = localStorage.getItem("jwt");
    try {
      const res = await api.post("/stores",payload, token);
    } catch (error) {
      
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.slug.trim()) {
      toast({
        title: "Validation Error",
        description: "Store Name and Slug are required.",
        variant: "destructive",
      });
      return;
    }

  
    if (form.type === 'medusa' && (!form.adminEmail || !form.adminPassword)) {
       toast({
        title: "Validation Error",
        description: "Admin Email and Password are required for Medusa.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await createStore(form);
      await onCreated();
    } catch (error) {
      
    }
    onOpenChange(false);
    setLoading(false);


  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Store</DialogTitle>
          <DialogDescription>
            Provision a new isolated store on Kubernetes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              placeholder="My Awesome Store"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Store Slug / Subdomain *</Label>
            <Input
              id="slug"
              placeholder="my-shop"
              value={form.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Store Type</Label>
            <select
              id="type"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="woocommerce">WooCommerce (WordPress)</option>
              <option value="medusa">Medusa JS (Headless)</option>
            </select>
          </div>

          {form.type === "medusa" && (
            <div className="space-y-4 border-l-2 pl-4  p-3 rounded-r-md animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email (Medusa)</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.adminEmail}
                  onChange={(e) => handleChange("adminEmail", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Admin Password (Medusa)</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.adminPassword}
                  onChange={(e) => handleChange("adminPassword", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Provisioning..." : "Create Store"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoreModal;