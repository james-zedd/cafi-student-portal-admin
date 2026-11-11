import Link from "next/link";
import {
  CircleQuestionMark,
  ClipboardCheck,
  LayoutDashboard,
  Newspaper,
  Users,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Dan Koto Shitsumon",
    href: "/dan-koto-shitsumon",
    icon: CircleQuestionMark,
  },
  { name: "News Feed", href: "/news-feed", icon: Newspaper },
  { name: "Exams", href: "/exams", icon: ClipboardCheck },
  { name: "Users", href: "/users", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Mobile: icon-only rail ~1/10 of the viewport. md+: full sidebar. */}
      <aside className="sticky top-0 flex h-screen w-[10vw] min-w-10 shrink-0 flex-col items-center border-r bg-muted/40 px-1 py-4 md:w-56 md:items-stretch md:p-4">
        <div className="mb-6 hidden px-3 text-lg font-semibold md:block">
          CAFI Admin
        </div>
        <nav className="flex w-full flex-1 flex-col gap-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.name}
              title={item.name}
              className="flex items-center justify-center gap-3 rounded-md py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground md:justify-start md:px-3"
            >
              <item.icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="hidden md:inline">{item.name}</span>
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
