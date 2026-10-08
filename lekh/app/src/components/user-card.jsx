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
  <Card className="text-center">
    <CardHeader className="font-bold text-xl">
      { user?.name }
    </CardHeader>
    <CardContent>
      { user?.email }
    </CardContent>
  </Card>
);

const UserCard = ({user, single}) => (
  <>
    {single && <SingleCard {...{user}} />}
    {!single && <Link href={`/users/${user.id}`}>
      <NavCard {...{user}} />
    </Link>}
  </>
);

export { UserCard };
