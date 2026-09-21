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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { addUser } from "@/service/add-user";

import schema from "@/schema/user-schema";

const CreateUserForm = ({ title, onSuccess, onFail }) => {
  const form = useForm({
    resolver: zodResolver(schema)
  });

  const handleSubmit = async (data) => (await addUser(data) ? onSuccess() : onFail());

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
            <FieldLabel htmlFor="name">Name</FieldLabel>
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

