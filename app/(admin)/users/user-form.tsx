"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";
import type { User } from "@/lib/types/user";

type UserFormProps = {
  mode: "add" | "edit";
  initialUser?: User;
};

type AddUserPayload = {
  name: string;
  email: string;
  password: string;
  roles: string[];
};

type EditUserPayload = {
  name: string;
  email: string;
  roles: string[];
};

export function UserForm({ mode, initialUser }: UserFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState(initialUser?.name ?? "");
  const [email, setEmail] = useState(initialUser?.email ?? "");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState(initialUser?.roles ?? []);

  const mutation = useMutation({
    mutationFn: (payload: AddUserPayload | EditUserPayload) => {
      if (mode === "add") {
        return api("/api/users", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      return api(`/api/users/${initialUser?.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(mode === "add" ? "User added" : "User updated");
      router.push("/users");
    },
    onError: (error) => {
      toast.error(`Failed to save user: ${error.message}`);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "add") {
      mutation.mutate({ name, email, password, roles });
    } else {
      mutation.mutate({ name, email, roles });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-2xl gap-6">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      {mode === "add" && (
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            maxLength={50}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="roles">Roles</Label>
        <TagInput
          id="roles"
          tags={roles}
          onTagsChange={setRoles}
          placeholder="Add a role…"
        />
      </div>
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/users")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mode === "add"
            ? mutation.isPending
              ? "Adding…"
              : "Add User"
            : mutation.isPending
              ? "Updating…"
              : "Update User"}
        </Button>
      </div>
    </form>
  );
}
