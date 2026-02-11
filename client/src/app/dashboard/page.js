"use client";
import toast from "react-hot-toast";
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
  const {isAuthenticated, isLoading} = useAuth();
  const [isGettingStores, setIsGettingStores] = useState(false);
  const [isDeleting,setIsDeleting] = useState(null);

  

  const fetchStores = async() => {
    try {
      setIsGettingStores(true);
      const token = localStorage.getItem("jwt");
      const stores = await api.get("/stores", token);
      if(typeof stores === 'object' && stores.length > 0) setStores(stores);
    }catch {}
    finally {
      setIsGettingStores(false);
    }
    
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
        router.replace("/auth");
    }
  }, [isAuthenticated, router, isLoading]);
  


  useEffect(()=> {
    fetchStores();
  },[]);


  useEffect(() => {
    const isProvisioning = stores.some((store) => (store.status === "PROVISIONING" || store.status === "DELETING"));
    let intervalId;

    if (isProvisioning) {
      intervalId = setInterval(fetchStores, 4000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };

  }, [stores]);
  

  const handleDelete = async(storeId) => {

    try {
      setIsDeleting(storeId);
      const token = localStorage.getItem("jwt");
      const res = await api.del(`/stores`, {storeId}, token);
      await(fetchStores());
      if(res.success) toast.success(res.message);
      else toast.error(res.message);

    } catch (error) {
      
    }finally {
      setIsDeleting(null);
    }
   
  };

  const handleCreated = async() => {
    await fetchStores();
    setModalOpen(false);
  };

  if(isLoading) return null;
  if(!isAuthenticated) return null;

 
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

      <StoreTable stores={stores} onDelete={handleDelete}  isLoading={isGettingStores} isDeleting={isDeleting}/>

      <CreateStoreModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default Dashboard;
