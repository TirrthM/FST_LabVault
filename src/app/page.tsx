import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  FlaskConical,
  ShieldCheck,
  Cpu,
  History,
  Gauge,
  Wrench,
  ArrowRight,
  Layers,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-card via-card to-muted/30 p-8 sm:p-12 shadow-xs text-center sm:text-left">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Academic Laboratory Asset & Metrology Platform</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            LabVault
          </h1>
          <p className="text-base sm:text-lg font-medium text-muted-foreground">
            Laboratory Equipment Lifecycle, Chain of Custody & Maintenance Platform
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Engineered for university engineering departments and research institutes. Manages the complete equipment lifecycle: acquisition, lab allocation, borrow requisitions, post-return inspection, technician maintenance work orders, ISO-17025 calibration scheduling, and immutable chain-of-custody audit histories.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 font-semibold shadow-md">
                <span>Enter Platform Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/equipment">
              <Button size="lg" variant="outline" className="gap-2">
                <Cpu className="h-4 w-4" />
                <span>Browse Equipment Catalog</span>
              </Button>
            </Link>
            <Link href="/ui">
              <Button size="lg" variant="ghost" className="gap-2 text-primary">
                <Layers className="h-4 w-4" />
                <span>UI Sandbox (Topic 1)</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Workflow Pillars */}
      <section className="space-y-4">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            End-to-End Equipment Lifecycle Architecture
          </h2>
          <p className="text-xs text-muted-foreground">
            Structured state machine transitions and audit custody tracking across four institutional roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-xs hover:border-primary/40 transition-colors">
            <CardContent className="p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <History className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                Chain of Custody & Audit Trail
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tracks every physical transfer: who borrowed the oscilloscope, when it was returned, who inspected probe condition, and any damage incidents.
              </p>
              <Link href="/activity" className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline">
                <span>Explore Custody Log</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-xs hover:border-primary/40 transition-colors">
            <CardContent className="p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <Wrench className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                Maintenance & Repair Queue
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Multi-stage work order tickets from student damage reports to technician diagnosis, component replacement logs, and return-to-service testing.
              </p>
              <Link href="/maintenance" className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline">
                <span>View Maintenance Queue</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-xs hover:border-primary/40 transition-colors">
            <CardContent className="p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                <Gauge className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                ISO-17025 Metrology & Calibration
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Monitors NIST traceability, next due dates, error offsets, and calibration certificates with automated Due Soon and Overdue alerts.
              </p>
              <Link href="/calibration" className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline">
                <span>Calibration Schedules</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Role Navigation Quick Guide */}
      <section className="rounded-xl border bg-muted/20 p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span>Interactive Role Simulation (Assignment 1 Architecture)</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          Use the top-right role switcher to test permissions and capabilities across the four user types:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-card rounded-lg border">
            <span className="font-semibold text-foreground">1. Student</span>
            <p className="text-muted-foreground text-[11px] mt-1">
              Browse inventory, submit custody requisitions, report lab hardware issues.
            </p>
          </div>
          <div className="p-3 bg-card rounded-lg border">
            <span className="font-semibold text-foreground">2. Lab Technician</span>
            <p className="text-muted-foreground text-[11px] mt-1">
              Inspect returns, record repairs, update work orders, certify calibrations.
            </p>
          </div>
          <div className="p-3 bg-card rounded-lg border">
            <span className="font-semibold text-foreground">3. Lab Manager</span>
            <p className="text-muted-foreground text-[11px] mt-1">
              Approve/reject borrow requests, assign assets to labs, review audit trail.
            </p>
          </div>
          <div className="p-3 bg-card rounded-lg border">
            <span className="font-semibold text-foreground">4. System Admin</span>
            <p className="text-muted-foreground text-[11px] mt-1">
              Commission new assets, manage laboratory departments, view system health.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
