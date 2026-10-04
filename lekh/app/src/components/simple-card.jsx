// https://ui.shadcn.com/docs/components/base/card
// https://nextjs.org/docs/app/api-reference/components/image#loading

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardContent,
  CardTitle
} from "@/components/ui/card";

const SimpleCard = ({ title, description }) => {

  if (!title) {
    return <div />
  }

  return (
    <Card className="md:max-w-md overflow-scroll print:hidden">
      <div className="flex items-center">
        <CardHeader className="min-w-0 flex-1">
          <CardTitle>
            {title}
          </CardTitle>

          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
      </div>
    </Card>
  );
};

export { SimpleCard };

