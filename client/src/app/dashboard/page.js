"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "../_components/ui/button";
import CreateStoreModal from "./components/CreateStoreModal";
import StoreTable from "./components/StoreTable";

const DUMMY_STORES = [
  {
    id: "1",
    name: "Electronics Hub",
    slug: "electronics-hub",
    namespace: "ns-electronics-hub",
    status: "READY",
    url: "http://electronics-hub.192.168.49.2.nip.io",
    createdAt: "2026-02-08T10:30:00Z",
    type: "WooCommerce",
    adminEmail: "admin@example.com",
  },
  {
    id: "2",
    name: "Fashion Store",
    slug: "fashion-store",
    namespace: "ns-fashion-store",
    status: "PROVISIONING",
    url: "",
    createdAt: "2026-02-09T14:15:00Z",
    type: "WooCommerce",
    adminEmail: "admin@example.com",
  },
  {
    id: "3",
    name: "Book World",
    slug: "book-world",
    namespace: "ns-book-world",
    status: "READY",
    url: "http://book-world.192.168.49.2.nip.io",
    createdAt: "2026-02-07T08:45:00Z",
    type: "WooCommerce",
    adminEmail: "admin@example.com",
  },
  {
    id: "4",
    name: "Gadget Zone",
    slug: "gadget-zone",
    namespace: "ns-gadget-zone",
    status: "FAILED",
    url: "",
    createdAt: "2026-02-09T09:00:00Z",
    type: "WooCommerce",
    adminEmail: "admin@example.com",
  },
  {
    id: "5",
    name: "Organic Grocers",
    slug: "organic-grocers",
    namespace: "ns-organic-grocers",
    status: "READY",
    url: "http://organic-grocers.192.168.49.2.nip.io",
    createdAt: "2026-02-06T16:20:00Z",
    type: "WooCommerce",
    adminEmail: "admin@example.com",
  },
];

const Dashboard = () => {
  const [stores, setStores] = useState(DUMMY_STORES);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = (id) => {
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCreated = () => {
    const newStore = {
      id: String(Date.now()),
      name: "New Store",
      slug: "new-store",
      namespace: "ns-new-store",
      status: "PROVISIONING",
      url: "",
      createdAt: new Date().toISOString(),
      type: "WooCommerce",
      adminEmail: "admin@example.com",
    };

    setStores((prev) => [newStore, ...prev]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Active Deployments
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your WooCommerce store instances across Kubernetes clusters.
          </p>
        </div>

        <Button size="sm" onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          Create New Store
        </Button>
      </div>

      <StoreTable stores={stores} onDelete={handleDelete} />

      <CreateStoreModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default Dashboard;
