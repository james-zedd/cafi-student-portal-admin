import type { NewsItem } from "@/lib/types/news";
import { truncate } from "@/lib/utils";

export { truncate };

export function newsTitle(item: NewsItem): string {
  if (item.title?.trim()) {
    return item.title;
  }
  return truncate(item.body, 70);
}
