"use client";


import { Trash2, ExternalLink, Loader2, Globe, Paintbrush, Settings, KeyRound, ChevronRight } from "lucide-react";
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


const statusConfig = {
  PROVISIONING: {
    label: "Provisioning...",
    className: "border-warning/30 bg-warning/10 text-warning animate-pulse-fast animate-float ",
  },
  BACKEND_READY: {
    label: "Setup Required",
    className: "border-primary/30 bg-primary/10 text-primary animate-pulse-fast animate-float",
  },
  READY: {
    label: "Ready",
    className: "border-success/30 bg-success/10 text-success",
  },
  FAILED: {
    label: "Failed",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  DELETING : {
   label : "Deleting...",
   className: "border-destructive/30 bg-destructive/10 text-destructive animate-pulse-fast animate-float"
  }

};








const StoreTable = ({ stores, onDelete, isLoading, isDeleting }) => {
  const router = useRouter();
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
                    {store.storeUrl  && store.status === "READY" ? (
                      <a
                        href={store.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        {store.storeUrl}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        —
                      </span>
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
                              )}`
                            )
                          }
                        >
                          <Paintbrush className="h-4 w-4" />
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
                      <SetupInstructions store={store} />
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StoreTable;
