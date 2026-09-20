"use client";

import * as React from "react";
import { useUserRoleStore } from "@/stores/user-role-store";
import { UserRole } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, GraduationCap, Wrench, Building2, ChevronDown } from "lucide-react";

import { switchSessionRole } from "@/actions/auth";
import { toast } from "sonner";

export function RoleSwitcher() {
  const { currentRole, currentUser, setRole } = useUserRoleStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectRole = async (role: UserRole) => {
    setRole(role);
    try {
      await switchSessionRole(role);
      toast.success(`Active session switched to ${role}`, {
        description: `Server-side session cookie synchronized for RBAC authorization.`,
      });
    } catch (e) {
      console.warn("Could not sync server session cookie:", e);
    }
  };

  if (!mounted) {
    return (
      <div className="h-9 w-36 animate-pulse rounded-md bg-muted/60" />
    );
  }

  const roleMeta: Record<
    UserRole,
    { label: string; icon: React.ComponentType<{ className?: string }>; badgeColor: string }
  > = {
    STUDENT: { label: "Student", icon: GraduationCap, badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300" },
    LAB_TECHNICIAN: { label: "Lab Technician", icon: Wrench, badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300" },
    LAB_MANAGER: { label: "Lab Manager", icon: Building2, badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300" },
    ADMIN: { label: "System Admin", icon: Shield, badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300" },
  };

  const CurrentIcon = roleMeta[currentRole]?.icon || GraduationCap;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-normal border-dashed">
          <CurrentIcon className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-foreground">{roleMeta[currentRole]?.label}</span>
          <span className="text-muted-foreground hidden lg:inline">({currentUser.name.split(" ")[0]})</span>
          <ChevronDown className="h-3 w-3 opacity-50 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
          Simulated User Session (Role Context)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(["STUDENT", "LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"] as UserRole[]).map((role) => {
          const Meta = roleMeta[role];
          const Icon = Meta.icon;
          const isSelected = currentRole === role;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleSelectRole(role)}
              className={`flex items-center justify-between cursor-pointer ${
                isSelected ? "bg-accent font-medium text-accent-foreground" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{Meta.label}</span>
              </div>
              {isSelected && <Badge variant="outline" className="text-[10px] py-0">Active</Badge>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
