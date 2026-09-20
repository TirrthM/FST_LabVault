"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/stores/ui-store";
import { useUserRoleStore } from "@/stores/user-role-store";
import { cn } from "@/lib/utils";
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
  FlaskConical,
  X,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const { currentRole } = useUserRoleStore();

  const navGroups = [
    {
      label: "Platform",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          badge: null,
          roles: ["STUDENT", "LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"],
        },
        {
          title: "Equipment Catalog",
          href: "/equipment",
          icon: Cpu,
          badge: "12",
          roles: ["STUDENT", "LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"],
        },
        {
          title: "Borrow Requests",
          href: "/borrow-requests",
          icon: ClipboardList,
          badge: "4",
          roles: ["STUDENT", "LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"],
        },
        {
          title: "Maintenance Queue",
          href: "/maintenance",
          icon: Wrench,
          badge: "2 Active",
          badgeVariant: "warning" as const,
          roles: ["LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"],
        },
        {
          title: "Calibration Schedule",
          href: "/calibration",
          icon: Gauge,
          badge: "1 Due",
          badgeVariant: "destructive" as const,
          roles: ["LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"],
        },
        {
          title: "Laboratories",
          href: "/labs",
          icon: Building2,
          badge: "6 Labs",
          roles: ["STUDENT", "LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"],
        },
        {
          title: "Chain of Custody Log",
          href: "/activity",
          icon: History,
          badge: null,
          roles: ["STUDENT", "LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"],
        },
      ],
    },
    {
      label: "Academic Deliverables",
      items: [
        {
          title: "UI Component Sandbox",
          href: "/ui",
          icon: Layers,
          badge: "Topic 1",
          roles: ["STUDENT", "LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"],
        },
        {
          title: "Settings & Session",
          href: "/settings",
          icon: Settings,
          badge: null,
          roles: ["STUDENT", "LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"],
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold tracking-tight text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none">LabVault</span>
              <span className="text-[10px] font-normal text-muted-foreground leading-tight">Lifecycle & Maintenance</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden h-8 w-8"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {group.label}
              </p>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const hasRoleAccess = item.roles.includes(currentRole);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={cn(
                        "group flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        !hasRoleAccess && "opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                            isActive
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : item.badgeVariant === "destructive"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              : item.badgeVariant === "warning"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info badge */}
        <div className="border-t p-3 bg-muted/20">
          <div className="rounded-md border border-border/80 bg-background/60 p-2.5 text-xs">
            <div className="flex items-center justify-between font-semibold text-foreground text-[11px]">
              <span>LabVault v1.0.0</span>
              <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">Assignment 1</Badge>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
              Extensible architecture ready for Assignment 2 Prisma integration.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
