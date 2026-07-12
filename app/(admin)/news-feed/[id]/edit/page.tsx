import { EditNewsItem } from "./edit-news-item";

export default async function EditNewsItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit News Item</h1>
      <div className="mt-6">
        <EditNewsItem id={id} />
      </div>
    </div>
  );
}
