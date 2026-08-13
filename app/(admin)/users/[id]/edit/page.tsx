import { EditUser } from "./edit-user";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit User</h1>
      <div className="mt-6">
        <EditUser id={id} />
      </div>
    </div>
  );
}
