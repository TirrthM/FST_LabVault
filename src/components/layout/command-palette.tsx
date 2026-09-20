"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUiStore } from "@/stores/ui-store";
import {
  LayoutDashboard,
  Cpu,
  ClipboardList,
  Wrench,
  Gauge,
  Building2,
  History,
  Settings,
  Layers,
  Search,
  ArrowRight,
} from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUiStore();
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, category: "Navigation" },
    { title: "Equipment Catalog", href: "/equipment", icon: Cpu, category: "Navigation" },
    { title: "Borrow Requests", href: "/borrow-requests", icon: ClipboardList, category: "Navigation" },
    { title: "Maintenance Queue", href: "/maintenance", icon: Wrench, category: "Navigation" },
    { title: "Calibration Schedule", href: "/calibration", icon: Gauge, category: "Navigation" },
    { title: "Laboratories", href: "/labs", icon: Building2, category: "Navigation" },
    { title: "Chain of Custody & Audit Activity", href: "/activity", icon: History, category: "Navigation" },
    { title: "UI Component Sandbox (Radix / shadcn)", href: "/ui", icon: Layers, category: "System & Docs" },
    { title: "Settings & Session Role", href: "/settings", icon: Settings, category: "System & Docs" },
  ];

  const filtered = navItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setCommandPaletteOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <Dialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <DialogContent className="p-0 max-w-xl overflow-hidden shadow-2xl border">
        <div className="p-4 border-b bg-muted/30">
          <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <span>LabVault Quick Navigation</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Search routes, equipment modules, and system views. Press Esc to close.
          </DialogDescription>
        </div>
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to page..."
            className="border-0 shadow-none focus-visible:ring-0 px-0 h-11 text-sm bg-transparent"
            autoFocus
          />
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No matching routes found.
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-medium text-foreground">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{item.category}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="border-t px-3 py-2 text-[11px] text-muted-foreground flex items-center justify-between bg-muted/20">
          <span>Navigate with mouse or Tab</span>
          <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">Ctrl + K / ⌘ + K</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
