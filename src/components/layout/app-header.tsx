"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { RoleSwitcher } from "./role-switcher";
import { useUiStore } from "@/stores/ui-store";
import {
  Menu,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();
  const { toggleSidebar, setCommandPaletteOpen } = useUiStore();

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return [{ label: "Home", href: "/" }];

    const crumbs = [{ label: "LabVault", href: "/dashboard" }];
    let path = "";
    segments.forEach((seg) => {
      path += `/${seg}`;
      const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
      crumbs.push({ label, href: path });
    });
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle navigation sidebar"
          className="lg:hidden h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href}>
              {idx > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/60" />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-semibold truncate max-w-[180px]">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Quick Search trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCommandPaletteOpen(true)}
          className="h-9 hidden md:flex items-center gap-2 text-xs text-muted-foreground font-normal px-3 w-48 justify-between"
        >
          <span className="flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5" />
            <span>Search LabVault...</span>
          </span>
          <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCommandPaletteOpen(true)}
          className="md:hidden h-9 w-9"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Role Switcher */}
        <RoleSwitcher />

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
