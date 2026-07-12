"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { NewsItem } from "@/lib/types/news";
import { NewsItemForm } from "../../news-item-form";

export function EditNewsItem({ id }: { id: string }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const response = await api<{ data: NewsItem }>(`/api/news/${id}`);
      return response.data;
    },
  });

  if (isPending) {
    return <p className="text-muted-foreground">Loading news item…</p>;
  }

  if (isError) {
    return (
      <p className="text-destructive">
        Failed to load news item: {error.message}
      </p>
    );
  }

  return (
    <NewsItemForm
      mode="edit"
      authorName={data.publisher.name}
      initialItem={data}
    />
  );
}
