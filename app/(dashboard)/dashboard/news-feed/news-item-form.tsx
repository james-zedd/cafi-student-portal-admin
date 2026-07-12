"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { NewsItem } from "@/lib/types/news";

type NewsItemFormProps = {
  mode: "add" | "edit";
  authorName: string;
  initialItem?: NewsItem;
};

type NewsItemPayload = {
  title: string;
  body: string;
  visible: boolean;
};

export function NewsItemForm({
  mode,
  authorName,
  initialItem,
}: NewsItemFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(initialItem?.title ?? "");
  const [body, setBody] = useState(initialItem?.body ?? "");
  const [visible, setVisible] = useState(initialItem?.visible ?? true);

  const mutation = useMutation({
    mutationFn: (payload: NewsItemPayload) => {
      if (mode === "add") {
        return api("/api/news", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      return api(`/api/news/${initialItem?._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["news"] });
      router.push("/dashboard/news-feed");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate({ title, body, visible });
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-2xl gap-6">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          rows={8}
          required
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="author">Author</Label>
        <Input id="author" value={authorName} disabled />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="visible"
          checked={visible}
          onCheckedChange={(checked) => setVisible(checked === true)}
        />
        <Label htmlFor="visible">Is Visible</Label>
      </div>
      {mutation.isError && (
        <p className="text-sm text-destructive">
          Failed to save news item: {mutation.error.message}
        </p>
      )}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/news-feed")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mode === "add"
            ? mutation.isPending
              ? "Adding…"
              : "Add News Item"
            : mutation.isPending
              ? "Updating…"
              : "Update News Item"}
        </Button>
      </div>
    </form>
  );
}
