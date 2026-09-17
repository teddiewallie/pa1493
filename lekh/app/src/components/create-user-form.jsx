// https://ui.shadcn.com/docs/components/base/field
// https://ui.shadcn.com/docs/components/base/select

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError
} from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const items = [ // TODO: Fetch from database
  { label: "Maintainer", value: "1" },
  { label: "Student", value: "2" }
];

const CreateUserForm = () => {
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(4, "Password must be at least 4 characters"),
    roleId: z.number().int().positive(),
  });

  const form = useForm({
    resolver: zodResolver(schema)
  });

  const handleSubmit = (data) => {
    console.log(data);
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
              aria-invalid={Boolean(form.formState.errors.name)} />
              <FieldError errors={[form.formState.errors.email]} />
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
            <Field className="flex">
              <FieldLabel htmlFor="Role">Role</FieldLabel>
              <Select items={items} id="roleId">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Button className="flex mt-7" type="submit">Create User</Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export { CreateUserForm };
