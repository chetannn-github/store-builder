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

const CreateStoreModal = ({ open, onOpenChange, onCreated }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "WooCommerce",
    adminEmail: "admin@example.com",
    password: "password123",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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

    setLoading(true);

    // Simulate provisioning delay
    setTimeout(() => {
      toast({
        title: "Store Created",
        description: "Provisioning has started.",
      });

      setForm({
        name: "",
        slug: "",
        type: "WooCommerce",
        adminEmail: "admin@example.com",
        password: "password123",
      });

      setLoading(false);
      onOpenChange(false);
      onCreated();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Store</DialogTitle>
          <DialogDescription>
            Provision a new WooCommerce store on Kubernetes.
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
            <Input
              id="type"
              value="WooCommerce"
              readOnly
              className="text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              value={form.adminEmail}
              onChange={(e) => handleChange("adminEmail", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              disabled={loading}
            />
          </div>

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
