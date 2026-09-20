import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlaskConical, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-primary">
        <FlaskConical className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        404 — Asset or Page Not Found
      </h1>
      <p className="text-sm text-muted-foreground max-w-md">
        The laboratory asset ID, requisition, or page you requested could not be located in the custody registry.
      </p>
      <div className="pt-2">
        <Link href="/dashboard">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
