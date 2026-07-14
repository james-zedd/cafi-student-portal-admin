"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
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
import type { KotoShitsumonItem } from "@/lib/types/koto-shitsumon";
import { truncate } from "@/lib/utils";
import { DeleteQuestionButton } from "./delete-question-button";
import { EditQuestionDialog } from "./edit-question-dialog";

const MAX_CELL_LENGTH = 100;

export function QuestionList() {
  const [query, setQuery] = useState("");
  const [editingItem, setEditingItem] = useState<KotoShitsumonItem | null>(
    null,
  );

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["kotoshitsumon"],
    queryFn: async () => {
      const response = await api<{ data: KotoShitsumonItem[] }>(
        "/api/kotoshitsumon",
      );
      return response.data;
    },
  });

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
              <TableHead>Question</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Correct Answer</TableHead>
              <TableHead>Explanation</TableHead>
              <TableHead>Answers</TableHead>
              <TableHead className="w-0">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="even:bg-muted/50">
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
                <TableCell className="align-top">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Edit question: ${truncate(item.question, 40)}`}
                      onClick={() => setEditingItem(item)}
                    >
                      Edit
                    </Button>
                    <DeleteQuestionButton item={item} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <EditQuestionDialog
        item={editingItem}
        onClose={() => setEditingItem(null)}
      />
    </div>
  );
}
