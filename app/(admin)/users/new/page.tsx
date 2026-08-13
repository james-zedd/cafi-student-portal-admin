import { UserForm } from "../user-form";

export default function NewUserPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Add User</h1>
      <div className="mt-6">
        <UserForm mode="add" />
      </div>
    </div>
  );
}
