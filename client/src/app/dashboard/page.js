"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "../_components/ui/button";
import CreateStoreModal from "./components/CreateStoreModal";
import StoreTable from "./components/StoreTable";
import { useAuth } from "../_hooks/useAuth";
import { useRouter } from "next/navigation";
import api from "@/lib/api";



const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const {isAuthenticated} = useAuth();

  useEffect(() => {
    if(!isAuthenticated) {
        router.replace("/auth");
      }
  },[]);

  const fetchStores = async() => {
    const token = localStorage.getItem("jwt");
    const stores = await api.get("/stores", token);
    setStores(stores);
  }


  useEffect(()=> {
    fetchStores();
  },[])
  

  const handleDelete = async(_id) => {

    try {
      const token = localStorage.getItem("jwt");
      await api.del(`/stores`, {storeId : _id}, token);
      await(fetchStores());

    } catch (error) {
      
    }finally {

    }
   
  };

  const handleCreated = async() => {
    await fetchStores();
    setModalOpen(false);
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
