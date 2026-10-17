import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const LinkButton = ({ href, variant="outline", size="default", children }) => (
  <Link className={buttonVariants({ variant, size })} {...{ href }}>
    { children }
  </Link>
);

export { LinkButton };
