import Link from "next/link";
import { Home } from "lucide-react";

import { AdminTable } from "@/components/admin-table";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-end">
        <Button asChild variant="ghost">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            回首頁
          </Link>
        </Button>
      </div>
      <AdminTable />
    </main>
  );
}
