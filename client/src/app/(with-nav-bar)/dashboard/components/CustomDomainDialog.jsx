import { useState } from "react";
import {
  Globe,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  XCircle
} from "lucide-react";

import { Button } from "../../../_components/ui/button";
import { Input } from "../../../_components/ui/input";
import { Label } from "../../../_components/ui/label";
import { Badge } from "../../../_components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../_components/ui/dialog";

import api from "@/lib/api";


const ConnectDomainDialog = ({
  open,
  onOpenChange,
  storeName,
  storeUrl,
  storeId,
}) => {
  const [step, setStep] = useState("enter-domain");
  const [domain, setDomain] = useState("");
  const [dnsRecords, setDnsRecords] = useState([]);
  const [copiedField, setCopiedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // New error state

  const resetAndClose = () => {
    setStep("enter-domain");
    setDomain("");
    setDnsRecords([]);
    setError(null);
    onOpenChange(false);
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConnectDomain = async () => {
    if (!domain.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('jwt');
      const res = await api.post("/domain/initiate", { storeId, customDomain: domain }, token);
      
      if(res?.success) {
        setDnsRecords([...res?.dnsRecords]);
        setStep("dns-validation");
      }
    } catch (err) {
        
      setError("Failed to initiate domain connection. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      setLoading(true);
      setError(null);
      setStep("validating");
      const token = localStorage.getItem('jwt');
      const res = await api.post("/domain/verify", { storeId }, token);
      
      if (res?.success) {
        setStep("ready-to-activate");
      } else {
        // Validation failed, show retry UI
        setStep("dns-validation");
        setError("Records not found yet. It might take a few more minutes to propagate.");
      }
    } catch (err) {
      setStep("dns-validation");
      setError("Could not reach DNS servers. Please check your records.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    try {
      setLoading(true);
      setStep("activating");
      const token = localStorage.getItem('jwt');
      const res = await api.post("/domain/active", { storeId }, token);
      if (res?.success) setStep("done");
    } catch (err) {
      setStep("ready-to-activate");
      setError("Server activation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CopyButton = ({ text, field }) => (
    <button onClick={() => copyToClipboard(text, field)} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors">
      {copiedField === field ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetAndClose(); }}>
      <DialogContent className="sm:max-w-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Globe className="h-5 w-5 text-primary" />
            {step === "done" ? "Domain Live!" : "Domain Setup"}
          </DialogTitle>
          <DialogDescription>
            {step === "done" ? `Success! ${domain} is linked.` : `Connect your custom domain to ${storeName}.`}
          </DialogDescription>
        </DialogHeader>

        {/* DNS Error Message - No more alerts! */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 flex gap-3 items-center animate-in fade-in slide-in-from-top-2">
            <XCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-xs text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* STEP: Enter Domain */}
        {step === "enter-domain" && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Domain Name</Label>
              <Input placeholder="www.yourstore.com" value={domain} onChange={(e) => setDomain(e.target.value)} className="text-lg font-mono" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-tight">E.g. shop.mybrand.in or www.example.com</p>
            </div>
          </div>
        )}

        {/* STEP: DNS Records Table */}
        {step === "dns-validation" && (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">Please configure these records in your DNS dashboard:</p>
            <div className="rounded-md border bg-muted/10 overflow-hidden">
              <div className="grid grid-cols-3 px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground bg-muted/30 border-b">
                <span>Type</span>
                <span>Host</span>
                <span>Value</span>
              </div>
              {dnsRecords.map((rec, i) => (
                <div key={i} className="grid grid-cols-3 px-3 py-3 text-xs font-mono items-center border-b last:border-0">
                  <Badge variant="outline" className="w-fit text-[9px] px-1">{rec?.type}</Badge>
                  <div className="flex items-center gap-1 overflow-hidden truncate">
                    <span className="truncate">{rec?.name}</span>
                    <CopyButton text={rec?.name} field={`n-${i}`} />
                  </div>
                  <div className="flex items-center gap-1 overflow-hidden truncate">
                    <span className="truncate">{rec?.value}</span>
                    <CopyButton text={rec?.value} field={`v-${i}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROCESSING STATES */}
        {(step === "validating" || step === "activating") && (
          <div className="flex flex-col items-center py-10 space-y-4">
            <div className="relative">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <Globe className="h-5 w-5 text-primary/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-sm font-medium">{step === "validating" ? "Checking DNS propagation..." : "Configuring server SSL..."}</p>
          </div>
        )}

        {/* READY TO ACTIVATE */}
        {step === "ready-to-activate" && (
          <div className="text-center py-8 space-y-4">
            <div className="bg-green-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-bold text-lg text-green-700">DNS Verified!</h3>
          </div>
        )}

        {/* SUCCESS */}
        {step === "done" && (
          <div className="text-center py-8 space-y-5">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <a href={`http://${domain}`} target="_blank" rel="noreferrer" className="text-xl font-bold text-primary hover:underline flex items-center justify-center gap-2">
              {domain} <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}

        <DialogFooter className="sm:justify-between border-t pt-4">
          <Button variant="ghost" onClick={resetAndClose} disabled={loading}>
            {step === "done" ? "Close" : "Cancel"}
          </Button>

          {step === "enter-domain" && (
            <Button onClick={handleConnectDomain} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Connect Domain"}
            </Button>
          )}

          {step === "dns-validation" && (
            <Button 
                onClick={handleValidate} 
                disabled={loading}
                variant={error ? "destructive" : "default"}
                className="min-w-[140px]"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : error ? (
                <><RefreshCw className="mr-2 h-4 w-4" /> Retry Now</>
              ) : (
                "Verify Records"
              )}
            </Button>
          )}

          {step === "ready-to-activate" && (
            <Button onClick={handleActivate} className="bg-green-600 hover:bg-green-700" disabled={loading}>
              Activate Storefront
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectDomainDialog;