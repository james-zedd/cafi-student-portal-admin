import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserList } from "./user-list";

export default function UsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Button nativeButton={false} render={<Link href="/users/new" />}>
          Add User
        </Button>
      </div>
      <div className="mt-6">
        <UserList />
      </div>
    </div>
  );
}
