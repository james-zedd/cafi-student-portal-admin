"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { User } from "@/lib/types/user";
import { UserForm } from "../../user-form";

export function EditUser({ id }: { id: string }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api<{ data: User[] }>("/api/users");
      return response.data;
    },
  });

  if (isPending) {
    return <p className="text-muted-foreground">Loading user…</p>;
  }

  if (isError) {
    return (
      <p className="text-destructive">Failed to load user: {error.message}</p>
    );
  }

  const user = data.find((item) => item.id === id);

  if (!user) {
    return <p className="text-destructive">User not found.</p>;
  }

  return <UserForm mode="edit" initialUser={user} />;
}
