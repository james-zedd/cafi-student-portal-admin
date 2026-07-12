import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Dan Koto Shitsumon", href: "/dashboard/dan-koto-shitsumon" },
  { name: "News Feed", href: "/dashboard/news-feed" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col border-r bg-muted/40 p-4">
        <div className="mb-6 px-3 text-lg font-semibold">CAFI Admin</div>
        <nav className="flex flex-1 flex-col gap-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
