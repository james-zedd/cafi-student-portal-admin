import type { NewsItem } from "@/lib/types/news";

export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

export function newsTitle(item: NewsItem): string {
  if (item.title?.trim()) {
    return item.title;
  }
  return truncate(item.body, 100);
}
