// https://ui.shadcn.com/docs/components/base/field
// https://ui.shadcn.com/docs/components/base/select
// https://ui.shadcn.com/docs/forms/react-hook-form#Checkbox

import { useContext } from "react";
import { useRouter } from "next/navigation";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError
} from "@/components/ui/field";

import { Checkbox } from "@/components/ui/checkbox";
import { UserContext } from "@/context/user-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { saveUser } from "@/service/save-user";

import { createUserSchema } from "@/schema/user-schema";

const CreateUserForm = ({ title, onSuccess, onFail, onDelete, user, canDelete }) => {
  const router = useRouter();
  const editing = Boolean(user);
  const schema = createUserSchema(editing);

  const { user: loggedInUser } = useContext(UserContext);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      id: user?.id,
      name: user?.name ?? "",
      email: user?.email ?? "",
      maintainer: user?.role_id == 1 || false
    }
  });

  const handleSubmit = async (data) => (await saveUser(data) ? onSuccess() : onFail());

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
      <FieldSet>
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

            {loggedInUser.role_id == 1 && <Controller
                name="maintainer"
                control={form.control}
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
                )} />}

          </div>
        </FieldGroup>
      </FieldSet>
      <FieldSet className="grid grid-cols-2 mt-6">
        { canDelete && <Button
          type="button"
          variant="destructive"
          onClick={() => onDelete()}
        >Delete User</Button>}
        { !canDelete && <div />}
        <Button type="submit">Save User</Button>
      </FieldSet>
    </form>
  );
};

export { CreateUserForm };

