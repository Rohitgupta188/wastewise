"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded ${
      pathname === path ? "bg-black text-white" : "hover:bg-gray-200"
    }`;

  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <Link href="/dashboard/admin" className={linkClass("/dashboard/admin")}>
          Dashboard
        </Link>
        <Link
          href="/dashboard/admin/ngo-requests"
          className={linkClass("/dashboard/admin/ngo-requests")}
        >
          NGO Requests
        </Link>
      </nav>
    </aside>
  );
}
