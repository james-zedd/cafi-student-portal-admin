"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NewsItem } from "@/lib/types/news";
import { DeleteNewsButton } from "./delete-news-button";
import { newsTitle, truncate } from "./news-utils";

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }
  return date.toISOString().slice(0, 10);
}

export function NewsList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const response = await api<{ data: NewsItem[] }>("/api/news");
      return response.data;
    },
  });

  if (isPending) {
    return <p className="text-muted-foreground">Loading news…</p>;
  }

  if (isError) {
    return (
      <p className="text-destructive">Failed to load news: {error.message}</p>
    );
  }

  if (data.length === 0) {
    return <p className="text-muted-foreground">No news items found.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((item) => (
        <Card key={item._id}>
          <CardHeader>
            <CardTitle>{newsTitle(item)}</CardTitle>
            <CardDescription>
              {item.publisher.name} · {formatDate(item.updatedAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{truncate(item.body, 200)}</p>
          </CardContent>
          <CardFooter className="mt-auto justify-between">
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/dashboard/news-feed/${item._id}/edit`} />}
            >
              Edit
            </Button>
            <DeleteNewsButton item={item} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
