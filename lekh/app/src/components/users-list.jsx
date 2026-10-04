import { UsersContext } from "@/context/users-context";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserCard } from "@/components/user-card";

const UsersList = () => {
  const { users } = useContext(UsersContext);
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-10 my-4">
      { users.map((user) => (<UserCard {...{user}} key={`${"user-" + user.id}`} />)) }
    </div>
  );
};

export { UsersList };
