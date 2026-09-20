"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Terminal,
  MousePointer,
  HelpCircle,
} from "lucide-react";

export default function UiSandboxPage() {
  const [switchState, setSwitchState] = React.useState(true);
  const [radioVal, setRadioVal] = React.useState("oscilloscope");

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Sandbox Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
          <Layers className="h-3.5 w-3.5" />
          <span>Self-Learning Topic 1 Demonstration</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Accessible UI Component Primitives Sandbox
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Demonstrating Radix UI unstyled accessible primitives styled with Tailwind CSS, supporting dark/light mode, full keyboard navigation (Tab, Esc, Arrows, Space, Enter), visible focus rings, ARIA roles, and high contrast.
        </p>
      </div>

      <Tabs defaultValue="buttons" className="w-full space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-6 h-auto p-1 bg-muted/60">
          <TabsTrigger value="buttons" className="text-xs py-2">Buttons & Badges</TabsTrigger>
          <TabsTrigger value="forms" className="text-xs py-2">Inputs & Form Controls</TabsTrigger>
          <TabsTrigger value="overlays" className="text-xs py-2">Dialogs & Sheets</TabsTrigger>
          <TabsTrigger value="menus" className="text-xs py-2">Dropdowns & Popovers</TabsTrigger>
          <TabsTrigger value="feedback" className="text-xs py-2">Tooltips & Toasts</TabsTrigger>
          <TabsTrigger value="tables" className="text-xs py-2">Data Tables</TabsTrigger>
        </TabsList>

        {/* 1. BUTTONS & BADGES */}
        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Button Variants & Sizes</CardTitle>
              <CardDescription className="text-xs">
                Built with Class Variance Authority (CVA), Slot composition, and focus-visible rings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2.5">
                <Button variant="default">Default Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="link">Link Style</Button>
                <Button disabled>Disabled State</Button>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t">
                <Button size="sm">Small Size (sm)</Button>
                <Button size="default">Default Size (default)</Button>
                <Button size="lg">Large Size (lg)</Button>
                <Button size="icon" aria-label="Icon only button"><Sparkles className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Semantic Status Badges</CardTitle>
              <CardDescription className="text-xs">
                Used throughout LabVault for equipment conditions, warranty periods, and priority levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Critical / Retired</Badge>
                <Badge variant="success">Available / Calibrated</Badge>
                <Badge variant="warning">Under Maintenance</Badge>
                <Badge variant="info">In Custody / Borrowed</Badge>
                <Badge variant="purple">Reserved</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. FORMS & INPUTS */}
        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Form Primitives & State Handling</CardTitle>
              <CardDescription className="text-xs">
                Accessible labeled inputs, select dropdowns, switch toggles, and radio groups.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="demo-input" className="text-xs font-medium">Standard Text Input</Label>
                  <Input id="demo-input" placeholder="e.g. Tektronix MSO 44" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="demo-select" className="text-xs font-medium">Radix Select Menu</Label>
                  <Select defaultValue="opt1">
                    <SelectTrigger id="demo-select">
                      <SelectValue placeholder="Choose option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="opt1">Electronics & Circuit Design Lab</SelectItem>
                      <SelectItem value="opt2">AIML & High Performance Computing</SelectItem>
                      <SelectItem value="opt3">Robotics & Autonomous Systems</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="demo-textarea" className="text-xs font-medium">Accessible Textarea</Label>
                <Textarea id="demo-textarea" rows={3} placeholder="Provide technical notes or calibration criteria..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t">
                {/* Switch Toggle */}
                <div className="flex items-center justify-between p-3 rounded-md border bg-muted/20">
                  <div className="space-y-0.5">
                    <Label htmlFor="demo-switch" className="text-xs font-semibold cursor-pointer">
                      Requires Certified Training
                    </Label>
                    <p className="text-[11px] text-muted-foreground">Enforce safety module prerequisite</p>
                  </div>
                  <Switch
                    id="demo-switch"
                    checked={switchState}
                    onCheckedChange={setSwitchState}
                  />
                </div>

                {/* Radio Group */}
                <div className="p-3 rounded-md border bg-muted/20 space-y-2">
                  <Label className="text-xs font-semibold">Asset Category Group</Label>
                  <RadioGroup value={radioVal} onValueChange={setRadioVal} className="flex gap-4">
                    <div className="flex items-center space-x-1.5">
                      <RadioGroupItem value="oscilloscope" id="r1" />
                      <Label htmlFor="r1" className="text-xs font-normal cursor-pointer">Oscilloscope</Label>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <RadioGroupItem value="spectrum" id="r2" />
                      <Label htmlFor="r2" className="text-xs font-normal cursor-pointer">Spectrum</Label>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <RadioGroupItem value="microscope" id="r3" />
                      <Label htmlFor="r3" className="text-xs font-normal cursor-pointer">Microscope</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. DIALOGS & OVERLAYS */}
        <TabsContent value="overlays" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Accessible Modals, Sheets & Alert Dialogs</CardTitle>
              <CardDescription className="text-xs">
                Supports focus trapping, Esc-to-close, screen reader portal mounting, and backdrop blurring.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              {/* Standard Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default">Open Standard Modal Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Radix Accessible Dialog</DialogTitle>
                    <DialogDescription>
                      This dialog traps focus within its portal, announces its ARIA role, and can be dismissed via Esc or backdrop tap.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-2 text-xs text-muted-foreground space-y-2">
                    <p>Sample interactive field inside trapped focus modal:</p>
                    <Input placeholder="Type here to verify tab order..." />
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={() => toast.success("Modal Action Confirmed")}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Alert Dialog (Destructive / Confirmation) */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Open Alert Dialog (Confirmation)</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Decommission Laboratory Asset?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will mark asset LV-EE-OSC-0101 as RETIRED and lock all subsequent borrow requisitions.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => toast.warning("Asset Decommissioned")}>
                      Proceed to Decommission
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Sheet (Slide-over Drawer) */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open Slide-Over Sheet</Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Asset Quick Inspector</SheetTitle>
                    <SheetDescription>
                      Slide-out panel for fast laboratory device diagnostics and history.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-3 text-xs">
                    <div className="p-3 bg-muted/40 rounded border space-y-1">
                      <span className="font-semibold text-foreground">Keysight Infiniium 1GHz</span>
                      <p className="text-muted-foreground font-mono">LV-ECE-OSC-0101</p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Slide-over drawers are ideal for mobile inspect views and secondary workflows without losing page scroll context.
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. DROPDOWNS & POPOVERS */}
        <TabsContent value="menus" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Dropdown Menus & Popovers</CardTitle>
              <CardDescription className="text-xs">
                Supports arrow key navigation, sub-menus, item indicators, and alignment collision detection.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Dropdown Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Laboratory Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.info("Requisition initiated")}>
                    Request Custody
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Diagnostic logged")}>
                    Log Maintenance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Calibration scheduled")}>
                    Record Calibration
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive font-medium">
                    Report Damage
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2 text-xs">
                    <h4 className="font-semibold text-foreground">NIST Calibration Standards</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Standard ISO/IEC 17025 specifies the general requirements for the competence, impartiality and consistent operation of calibration laboratories.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. TOOLTIPS & TOASTS */}
        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Tooltips & Accessible Toast Notifications</CardTitle>
              <CardDescription className="text-xs">
                Hover or focus triggers for micro-assistance, plus rich toast feedback via Sonner.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" aria-label="Help info">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>NIST Traceability Certificate ID: CERT-2026-991</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  variant="outline"
                  onClick={() =>
                    toast.success("Custody Requisition Approved", {
                      description: "Alex Rivera assigned asset LV-ECE-OSC-0102.",
                    })
                  }
                >
                  Trigger Success Toast
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    toast.error("Calibration Overdue Alert", {
                      description: "Fluke 8846A is 36 days past scheduled recalibration.",
                    })
                  }
                >
                  Trigger Error Toast
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    toast.info("Firmware Patch Available", {
                      description: "Tektronix firmware v2.4.1 ready for deployment.",
                    })
                  }
                >
                  Trigger Info Toast
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. DATA TABLES */}
        <TabsContent value="tables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Responsive Tabular Data Presentation</CardTitle>
              <CardDescription className="text-xs">
                Clean typography, borders, hover rows, and screen reader-friendly captioning.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Instrument Name</TableHead>
                    <TableHead>Department Lab</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Calibration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  <TableRow>
                    <TableCell className="font-mono font-bold">LV-ECE-OSC-0101</TableCell>
                    <TableCell className="font-medium">Keysight Infiniium 1GHz DSO</TableCell>
                    <TableCell>Electronics & Circuit Design</TableCell>
                    <TableCell><Badge variant="success">AVAILABLE</Badge></TableCell>
                    <TableCell className="text-emerald-600 font-medium">Nov 20, 2026</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono font-bold">LV-RF-SPEC-0201</TableCell>
                    <TableCell className="font-medium">Rohde & Schwarz FPC1500</TableCell>
                    <TableCell>Advanced RF Communications</TableCell>
                    <TableCell><Badge variant="warning">UNDER_MAINTENANCE</Badge></TableCell>
                    <TableCell className="text-amber-600 font-medium">Due in 8d</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono font-bold">LV-AI-WRK-0301</TableCell>
                    <TableCell className="font-medium">Dual RTX 6000 Ada Workstation</TableCell>
                    <TableCell>AIML & HPC Lab</TableCell>
                    <TableCell><Badge variant="success">AVAILABLE</Badge></TableCell>
                    <TableCell className="text-muted-foreground">N/A</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
