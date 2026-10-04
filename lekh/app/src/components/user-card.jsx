import Link from "next/link";

import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

const NavCard = ({ user }) => (
  <Card className="text-center cursor-pointer md:max-w-104">
    <CardHeader className="font-bold text-xl">
      { user?.name }
    </CardHeader>
    <CardContent>
      { user?.email }
    </CardContent>
  </Card>
);

const SingleCard = ({ user }) => (
  <Card className="text-center mx-4 md:max-w-104">
    <CardHeader className="font-bold text-xl">
      { user?.name }
    </CardHeader>
    <CardContent>
      { user?.email }
    </CardContent>
  </Card>
);

const UserCard = ({user, single}) => (
  <Link href={`/users/${user.id}`}>
    {single && <SingleCard {...{user}} />}
    {!single && <NavCard {...{user}} />}
  </Link>
);

export { UserCard };
