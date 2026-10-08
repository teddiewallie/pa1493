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

const SimpleCard = ({ title, description, content }) => {

  if (!title) {
    return <div />
  }

  return (
    <Card className="overflow-scroll print:hidden">
      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>

        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="whitespace-pre-line">
        { content }
      </CardContent>
    </Card>
  );
};

export { SimpleCard };

