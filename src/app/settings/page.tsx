"use client";

import * as React from "react";
import { useUserRoleStore } from "@/stores/user-role-store";
import { useEquipmentFilterStore } from "@/stores/equipment-filter-store";
import { UserRole } from "@/types";
import { SEED_USERS } from "@/data/seed-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { toast } from "sonner";
import {
  Settings,
  UserCheck,
  RotateCcw,
  Shield,
  GraduationCap,
  Wrench,
  Building2,
  Cpu,
  Layers,
  Check,
} from "lucide-react";

import { switchSessionRole } from "@/actions/auth";

export default function SettingsPage() {
  const { currentRole, currentUser, setRole } = useUserRoleStore();
  const clearFilters = useEquipmentFilterStore((s) => s.clearFilters);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleRoleChange = async (role: UserRole, title: string) => {
    setRole(role);
    try {
      await switchSessionRole(role);
      toast.success(`Role Switched to ${title}`, {
        description: "Server session cookie synchronized.",
      });
    } catch (e) {
      toast.success(`Role Switched to ${title}`);
    }
  };

  if (!mounted) {
    return <div className="max-w-4xl mx-auto py-8 text-center text-sm text-muted-foreground">Loading settings...</div>;
  }

  const roleList: { role: UserRole; title: string; desc: string; icon: any }[] = [
    {
      role: "STUDENT",
      title: "Student Requisitioner",
      desc: "Search equipment, submit borrow requisitions, view personal history, report equipment faults.",
      icon: GraduationCap,
    },
    {
      role: "LAB_TECHNICIAN",
      title: "Laboratory Technician",
      desc: "Manage maintenance work orders, inspect returned instruments, record ISO-17025 calibrations.",
      icon: Wrench,
    },
    {
      role: "LAB_MANAGER",
      title: "Laboratory Manager",
      desc: "Review and approve/reject borrow requisitions, monitor lab custody load, review audit trails.",
      icon: Building2,
    },
    {
      role: "ADMIN",
      title: "System Administrator",
      desc: "Full administrative access, commission new assets, manage lab assignments, system health logs.",
      icon: Shield,
    },
  ];

  const handleResetSession = () => {
    clearFilters();
    toast.success("Client State Reset", {
      description: "Zustand filters and saved bookmarks cleared.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-primary" />
          <span>Platform Settings & Simulated Session</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Switch user roles, configure theme preferences, and review Assignment 1 client/server state architecture.
        </p>
      </div>

      {/* User Role Switcher */}
      <Card>
        <CardHeader className="p-5 pb-3 border-b bg-muted/10">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" />
            <span>Active Institutional Role (Session Simulation)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            LabVault uses role-aware UI abstractions. In Assignment 2, this will be tied to NextAuth / JWT server sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roleList.map((r) => {
              const Icon = r.icon;
              const isSelected = currentRole === r.role;
              return (
                <div
                  key={r.role}
                  onClick={() => handleRoleChange(r.role, r.title)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                      : "hover:bg-muted/40 hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-md ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-sm text-foreground">{r.title}</span>
                    </div>
                    {isSelected && <Badge variant="default" className="text-[10px]">Active</Badge>}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Current Active Profile info */}
          <div className="rounded-lg border bg-muted/20 p-4 text-xs space-y-1">
            <span className="font-semibold text-foreground">Current Active Mock User Profile:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-muted-foreground pt-1">
              <div><strong>Name:</strong> {currentUser.name}</div>
              <div><strong>Email:</strong> {currentUser.email}</div>
              <div><strong>ID:</strong> {currentUser.studentOrEmployeeId}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme and Preferences */}
      <Card>
        <CardHeader className="p-5 pb-3 border-b bg-muted/10">
          <CardTitle className="text-base font-semibold">
            Visual Theme & Client Store Management
          </CardTitle>
          <CardDescription className="text-xs">
            Client-side preferences stored in Zustand and localStorage.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground text-sm">Theme Appearance</p>
              <p className="text-muted-foreground">Toggle Light, Dark, or System theme preference</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-semibold text-foreground text-sm">Reset Client Filters & Saved Items</p>
              <p className="text-muted-foreground">Clear all local equipment filter preferences in localStorage</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleResetSession} className="gap-1 text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
