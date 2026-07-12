import { getAuthUser } from "@/lib/auth";
import { NewsItemForm } from "../news-item-form";

export default async function NewNewsItemPage() {
  const user = await getAuthUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Add News Item</h1>
      <div className="mt-6">
        <NewsItemForm mode="add" authorName={user?.name ?? ""} />
      </div>
    </div>
  );
}
