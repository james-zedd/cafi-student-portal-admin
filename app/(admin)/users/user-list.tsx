"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/lib/types/user";

export function UserList() {
  const [query, setQuery] = useState("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api<{ data: User[] }>("/api/users");
      return response.data;
    },
  });

  if (isPending) {
    return <p className="text-muted-foreground">Loading users…</p>;
  }

  if (isError) {
    return (
      <p className="text-destructive">Failed to load users: {error.message}</p>
    );
  }

  if (data.length === 0) {
    return <p className="text-muted-foreground">No users found.</p>;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredData = normalizedQuery
    ? data.filter((user) =>
        [user.name, user.email, ...user.roles].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        ),
      )
    : data;

  return (
    <div className="grid gap-4">
      <Input
        type="search"
        placeholder="Search users…"
        aria-label="Search users"
        className="w-full border-muted-foreground/60"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {filteredData.length === 0 ? (
        <p className="text-muted-foreground">No matches for search query</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="w-0">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((user) => (
              <TableRow key={user.id} className="even:bg-chart-1/50">
                <TableCell className="whitespace-normal align-top">
                  {user.name}
                </TableCell>
                <TableCell className="whitespace-normal align-top">
                  {user.email}
                </TableCell>
                <TableCell className="align-top">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    aria-label={`Edit user: ${user.name}`}
                    render={<Link href={`/users/${user.id}/edit`} />}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
