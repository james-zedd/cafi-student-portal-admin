import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsList } from "./news-list";

export default function NewsFeedPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">News Feed</h1>
        <Button render={<Link href="/dashboard/news-feed/new" />}>
          Add News Item
        </Button>
      </div>
      <div className="mt-6">
        <NewsList />
      </div>
    </div>
  );
}
