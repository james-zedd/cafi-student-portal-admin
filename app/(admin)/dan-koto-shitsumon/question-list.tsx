"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { KotoShitsumonItem } from "@/lib/types/koto-shitsumon";
import { truncate } from "@/lib/utils";

const MAX_CELL_LENGTH = 100;

export function QuestionList() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["kotoshitsumon"],
    queryFn: async () => {
      const response = await api<{ data: KotoShitsumonItem[] }>(
        "/api/kotoshitsumon",
      );
      return response.data;
    },
  });

  function toggleSelected(id: string, checked: boolean) {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  if (isPending) {
    return <p className="text-muted-foreground">Loading questions…</p>;
  }

  if (isError) {
    return (
      <p className="text-destructive">
        Failed to load questions: {error.message}
      </p>
    );
  }

  if (data.length === 0) {
    return <p className="text-muted-foreground">No questions found.</p>;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredData = normalizedQuery
    ? data.filter((item) =>
        [
          item.question,
          item.correct_answer,
          item.explanation,
          ...item.categories,
          ...item.answers,
        ].some((value) => value.toLowerCase().includes(normalizedQuery)),
      )
    : data;

  return (
    <div className="grid gap-4">
      <Input
        type="search"
        placeholder="Search questions…"
        aria-label="Search questions"
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
              <TableHead className="w-8" />
              <TableHead>Question</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Correct Answer</TableHead>
              <TableHead>Explanation</TableHead>
              <TableHead>Answers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item.id}
                className="even:bg-muted/50"
                data-state={selectedIds.has(item.id) ? "selected" : undefined}
              >
                <TableCell>
                  <Checkbox
                    aria-label={`Select question: ${truncate(item.question, 40)}`}
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={(checked) =>
                      toggleSelected(item.id, checked === true)
                    }
                  />
                </TableCell>
                <TableCell className="whitespace-normal align-top">
                  {truncate(item.question, MAX_CELL_LENGTH)}
                </TableCell>
                <TableCell className="whitespace-normal align-top">
                  {truncate(item.categories.join(", "), MAX_CELL_LENGTH)}
                </TableCell>
                <TableCell className="whitespace-normal align-top">
                  {truncate(item.correct_answer, MAX_CELL_LENGTH)}
                </TableCell>
                <TableCell className="whitespace-normal align-top">
                  {truncate(item.explanation, MAX_CELL_LENGTH)}
                </TableCell>
                <TableCell className="whitespace-normal align-top">
                  {truncate(item.answers.join(", "), MAX_CELL_LENGTH)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
