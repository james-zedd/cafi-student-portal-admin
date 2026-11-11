"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="self-center border border-zinc-400 md:self-start"
      aria-label="Sign out"
      title="Sign out"
      onClick={handleLogout}
    >
      <LogOut className="size-4" aria-hidden="true" />
    </Button>
  );
}
