import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

const NavCard = ({ user, handleClick }) => (
  <Card className="text-center cursor-pointer md:max-w-104" onClick={() => handleClick(user.id)}>
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

const UserCard = ({user, handleClick}) => (
  <>
    { handleClick && <NavCard {...{user, handleClick}} /> }
    { !handleClick && <SingleCard {...{user}} /> }
  </>
);

export { UserCard };
