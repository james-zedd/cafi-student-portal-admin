"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TagInput({
  id,
  tags,
  onTagsChange,
  placeholder,
  maxTags,
}: {
  id: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}) {
  const [draft, setDraft] = useState("");
  const atLimit = maxTags !== undefined && tags.length >= maxTags;

  function addDraft() {
    const value = draft.trim();
    if (!value || atLimit || tags.includes(value)) {
      return;
    }
    onTagsChange([...tags, value]);
    setDraft("");
  }

  function removeTag(index: number) {
    onTagsChange(tags.filter((_, tagIndex) => tagIndex !== index));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addDraft();
    } else if (event.key === "Tab" && draft.trim() !== "") {
      // Commit the draft as a tag instead of tabbing to the next field,
      // so Tab never silently discards unsaved input.
      event.preventDefault();
      addDraft();
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }

  return (
    <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
      {tags.map((tag, index) => (
        <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1 pr-1">
          <span className="max-w-48 truncate">{tag}</span>
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            className="rounded-full hover:text-destructive focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            onClick={() => removeTag(index)}
          >
            <XIcon className="size-3" />
          </button>
        </Badge>
      ))}
      <input
        id={id}
        value={draft}
        disabled={atLimit}
        placeholder={atLimit ? undefined : placeholder}
        aria-label={placeholder}
        className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addDraft}
      />
    </div>
  );
}
