import * as React from "react";
import { borrowRepository } from "@/data/repository";
import { BorrowRequestsView } from "@/components/borrowing/borrow-requests-view";

export const metadata = {
  title: "Borrow Requests — LabVault",
  description: "Track, approve, check out, and inspect academic laboratory equipment loans.",
};

export const dynamic = "force-dynamic";

export default async function BorrowRequestsPage() {
  const requests = await borrowRepository.findMany();
  return <BorrowRequestsView initialRequests={requests} />;
}
