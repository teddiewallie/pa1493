// https://ui.shadcn.com/blocks/login

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { getLanding } from "@/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}) {
  const router = useRouter();
  const [ hasError, setError ] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false
    });

    if (result?.error) {
      setError(true);
      return;
    }

    router.push(getLanding().route);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Lab Equipment Knowledge Hub</CardTitle>
          <CardDescription>Do stuff with things.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" name="email" required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" name="password" required />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        { hasError && <CardFooter className="bg-destructive/10 text-destructive">
            Invalid email or password.
        </CardFooter> }
      </Card>
    </div>
  )
}

