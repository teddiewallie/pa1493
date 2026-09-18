// https://ui.shadcn.com/docs/components/base/field
// https://ui.shadcn.com/docs/components/base/select
// https://ui.shadcn.com/docs/forms/react-hook-form#Checkbox

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError
} from "@/components/ui/field";

import { Checkbox } from "@/components/ui/checkbox";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { validateUser } from "@/services/validate-user";

const CreateUserForm = () => {
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(4, "Password must be at least 4 characters"),
    maintainer: z.boolean()
  });

  const form = useForm({
    resolver: zodResolver(schema)
  });

  const handleSubmit = (data) => {
    validateUser(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
      <FieldSet className="w-full max-w-xs">
        <FieldGroup>
          <Field data-invalid={Boolean(form.formState.errors.email)}>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="me@home.arpa"
              autoComplete="off"
              {...form.register("email")}
              noValidate
              aria-invalid={Boolean(form.formState.errors.email)}/>
              <FieldError errors={[form.formState.errors.email]} />
          </Field>
          <Field data-invalid={Boolean(form.formState.errors.password)}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldDescription>
              Must be at least 4 characters long.
            </FieldDescription>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...form.register("password")}
              noValidate
              autoComplete="off"
              aria-invalid={Boolean(form.formState.errors.password)} />
              <FieldError errors={[form.formState.errors.password]} />
          </Field>
          <Field data-invalid={Boolean(form.formState.errors.name)}>
            <FieldLabel htmlFor="Name">Name</FieldLabel>
            <Input
              id="name"
              type="name"
              placeholder="Me Meson"
              {...form.register("name")}
              aria-invalid={Boolean(form.formState.errors.name)} />
              <FieldError errors={[form.formState.errors.name]} />
          </Field>
          <div className="container flex items-center gap-12">
              <Controller
                name="maintainer"
                control={form.control}
                defaultValue={false}
                render={({field}) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="maintainer"
                      name="maintainer"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="maintainer">
                      Set as maintainer
                    </FieldLabel>
                  </Field>
                )} />
            <Button className="flex mt-7" type="submit">Create User</Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export { CreateUserForm };

