"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, Menu, X, LogOut } from "lucide-react";
import { Button } from "../_components/ui/button";
import { cn } from "../../lib/utils";


const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  

  const isAuthenticated = false;

  const navItems = [
    { label: "Home", path: "/" },
    ...(isAuthenticated ? [{ label: "Dashboard", path: "/dashboard" }] : []),
    { label: "Documentation", path: "/docs" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground">
          <Box className="h-5 w-5 text-primary" />
          <span className="text-lg tracking-tight">
            K8s Store Orchestrator
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.path
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="ml-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/auth" className="ml-3">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.path
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              >
                Logout ({user?.email})
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-accent/50"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
