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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { addItem } from "@/services/add-item";

import schema from "@/schema/item-schema";

const CreateItemForm = ({ onSuccess, onFail }) => {
  const form = useForm({
    resolver: zodResolver(schema)
  });

  const handleSubmit = async (data) => (await addItem(data) ? onSuccess() : onFail());

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
      <FieldSet className="w-full max-w-xs">
        <FieldGroup>
          <Field data-invalid={Boolean(form.formState.errors.name)}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="name"
              placeholder="Raspberry PI 4"
              {...form.register("name")}
              aria-invalid={Boolean(form.formState.errors.name)} />
              <FieldError errors={[form.formState.errors.name]} />
          </Field>
          <Field data-invalid={Boolean(form.formState.errors.serial)}>
            <FieldLabel htmlFor="serial">Serial</FieldLabel>
            <Input
              id="serial"
              type="serial"
              placeholder="S3R1-A1"
              {...form.register("serial")}
              aria-invalid={Boolean(form.formState.errors.serial)} />
              <FieldError errors={[form.formState.errors.serial]} />
          </Field>
          <Field data-invalid={Boolean(form.formState.errors.description)}>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
              id="description"
              type="description"
              placeholder="description"
              {...form.register("description")}
              aria-invalid={Boolean(form.formState.errors.description)} />
              <FieldError errors={[form.formState.errors.description]} />
          </Field>
          <div className="container flex items-center gap-12">
            <Button className="flex mt-7" type="submit">Create Item</Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export { CreateItemForm };

