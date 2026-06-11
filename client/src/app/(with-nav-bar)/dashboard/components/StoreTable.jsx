"use client";

import { Trash2, ExternalLink, Loader2, Link, Paintbrush, Settings, KeyRound, ChevronRight, Globe } from "lucide-react";
import { Button } from "../../../_components/ui/button";
import { Badge } from "../../../_components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../_components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../_components/ui/alert-dialog";
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
import { cn } from "../../../../lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { SetupInstructions } from "./SetupInstructions";
import ConnectDomainDialog from "./CustomDomainDialog";


const statusConfig = {
  PROVISIONING: {
    label: "Deploying...",
    className: "border-warning/30 bg-warning/10 text-warning animate-pulse-fast animate-float ",
  },
  BACKEND_READY: {
    label: "Setup Required",
    className: "border-primary/30 bg-primary/10 text-primary animate-pulse-fast animate-float",
  },
  READY: {
    label: "Live",
    className: "border-success/30 bg-success/10 text-success",
  },
  FAILED: {
    label: "Failed",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  DELETING : {
   label : "Deleting...",
   className: "border-destructive/30 bg-destructive/10 text-destructive animate-pulse-fast animate-float"
  },
  DELETION_FAILED: {
    label: "Deletion Failed",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  DEPLOYING_FRONTEND: {
    label: "Deploying...",
    className: "border-warning/30 bg-warning/10 text-warning animate-pulse-fast animate-float ",
  },

};








const StoreTable = ({ stores, onDelete, isLoading, isDeleting,fetchStores }) => {
  const router = useRouter();
  const [keyDialogStore, setKeyDialogStore] = useState(null);
  const [publishableKey, setPublishableKey] = useState("");
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);
   const [domainStore, setDomainStore] = useState(null);
  
  if (!stores || stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
      {!isLoading && (
          <>
            <p className="text-lg font-medium text-muted-foreground">
              No stores deployed yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click "Create New Store" to get started.
            </p>
          </>
        )}


        {isLoading && (<>
            <Loader2 className="w-15 h-15 mr-2 animate-spin" />
            Getting your stores
          </>)}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {stores.map((store) => {
            const status = statusConfig[store.status];

            return (
              <>
                <TableRow key={store._id}>
                  <TableCell className="font-medium">
                    {store.name}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", status?.className)}
                    >
                      {status?.label}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {(store.status === "READY") ? (
                      <div className="flex flex-col gap-1 text-sm">

                        {/* Default Store URL */}
                        {store.status === "READY" && store.storeUrl && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-28">
                              Store URL:
                            </span>

                            <a
                              href={store.storeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline truncate max-w-[240px]"
                              title={store.storeUrl}
                            >
                              {store.storeUrl}
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          </div>
                        )}

                        {store.domainStatus === "ACTIVE" && store.customDomain && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-28">
                              Custom Domain:
                            </span>

                            <a
                              href={`https://${store.customDomain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline truncate max-w-[240px]"
                              title={store.customDomain}
                            >
                              {store.customDomain}
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          </div>
                        )}

                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(store.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {store.status === "READY" && store.storeType === "woocommerce" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "transition-all",
                            store.domainStatus === "ACTIVE" 
                              ? "text-green-500 " 
                              : "text-primary hover:bg-primary/10"
                          )}
                          onClick={() => setDomainStore(store)}
                          title={store.domainStatus === "ACTIVE" ? "Domain Connected" : "Connect Domain"}
                        >
                          {store.domainStatus === "ACTIVE" ? (
                            <Globe className="h-4 w-4" /> // Connected hai toh Globe dikhao
                          ) : (
                            <Link className="h-4 w-4" /> // Nahi hai toh Link icon
                          )}
                        </Button>
                      )}

                      {store.storeUrl && store.status === "READY" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.replace(
                              `/customize?name=${encodeURIComponent(
                                store.name
                              )}&url=${encodeURIComponent(
                                store.storeUrl
                              )}&storeId=${encodeURIComponent(
                                store._id
                              )}`
                            )
                          }
                        >
                          <Paintbrush className="h-4 w-4" />
                        </Button>
                      )}

                      {store.status === "READY" && store.storeType === 'medusa' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setKeyDialogStore(store);
                            setPublishableKey("");
                          }}
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                          >
                            {isDeleting !== store?._id ? (
                              <Trash2 className="h-4 w-4" />
                            ) : (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Store
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "
                              {store.name}" and tear down all
                              associated Kubernetes resources.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                onDelete(store._id)
                              }
                              className="bg-destructive text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>

                {store.status === "BACKEND_READY" && (
                  <TableRow key={`${store._id}-setup`}>
                    <TableCell colSpan={6} className="p-0">
                      <SetupInstructions store={store} fetchStores={fetchStores}/>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>


      <div>
        <Dialog
          open={!!keyDialogStore}
          onOpenChange={(open) => {
            if (!open) {
              setKeyDialogStore(null);
              setPublishableKey("");
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                Update Publishable Key
              </DialogTitle>
              <DialogDescription>
                <div>
                  Enter publishable key for{" "}
                  <strong>{keyDialogStore?.name}</strong>
                </div>
                  {keyDialogStore?.adminUrl && (
                    <div className="rounded-md border bg-muted/40 p-3 space-y-2 mt-3">
                      <p className="font-medium text-foreground">
                        How to get your Publishable Key:
                      </p>

                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-xs">
                        <li>
                          Open your Admin Panel:
                          <div>
                            <a
                              href={keyDialogStore.adminUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline break-all"
                            >
                              {keyDialogStore.adminUrl}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </li>
                        <li>
                          Navigate to:
                          <code className="ml-1 rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">
                            Settings → Developer → Publishable Key
                          </code>
                        </li>
                        <li>Copy the key and paste it below.</li>
                      </ol>
                    </div>
                  )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-2">
              <Label htmlFor="publishable-key">
                Publishable Key
              </Label>
              <Input
                id="publishable-key"
                placeholder="pk_live_xxxxxxxxxxxxxxxxx"
                value={publishableKey}
                onChange={(e) =>
                  setPublishableKey(e.target.value)
                }
                className="font-mono text-xs"
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setKeyDialogStore(null);
                  setPublishableKey("");
                }}
              >
                Cancel
              </Button>

              <Button
                disabled={isUpdatingKey}
                onClick={async () => {
                  if (!publishableKey.trim()) {
                    return;
                  }

                  try {
                    setIsUpdatingKey(true);
                    const payload = {
                      storeId: keyDialogStore._id,
                      publishableKey 
                    }
                    const token = localStorage.getItem('jwt');  
                    const res = await api.post("/stores/deploy-medusa-storefront",payload, token);
          
                    if (!res.success) {
                      throw new Error(res?.message || "Setup failed");
                    }
                    await fetchStores();

                    toast.success("Publishable key updated");
                    setKeyDialogStore(null);
                    setPublishableKey("");
                  } catch (err) {
                    console.log(err)
                    toast.error("Failed to update key");
                  } finally {
                    setIsUpdatingKey(false);
                  }
                }}
              >
                {isUpdatingKey ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Key"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>

      {domainStore && (
        <ConnectDomainDialog
          open={!!domainStore}
          onOpenChange={(open) => { if (!open) setDomainStore(null); }}
          storeName={domainStore.name}
          storeUrl={domainStore.storeUrl}
          storeId={domainStore._id}
        />
      )}
    </div>
  );
};

export default StoreTable;
