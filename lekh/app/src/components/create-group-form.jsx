"use client";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError
} from "@/components/ui/field";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { saveGroup } from "@/service/save-group";
import { createGroupSchema } from "@/schema/group-schema";

const CreateGroupForm = ({ onSuccess, onFail, group, groupId }) => {
  const schema = createGroupSchema();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      id: group?.id ?? groupId,
      name: group?.name ?? "",
      description: group?.description ?? ""
    }
  });

  const handleSubmit = async (data) => (
    await saveGroup(data) ? onSuccess() : onFail()
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
      <FieldSet>
        <FieldGroup>
          <Field data-invalid={Boolean(form.formState.errors.name)}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Raspberry Pi 4 Model B"
              {...form.register("name")}
              aria-invalid={Boolean(form.formState.errors.name)}
            />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field data-invalid={Boolean(form.formState.errors.description)}>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
              id="description"
              type="text"
              placeholder="Raspberry Pi 4B development boards"
              {...form.register("description")}
              aria-invalid={Boolean(form.formState.errors.description)}
            />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <div className="container flex items-center gap-12">
            <Button className="flex mt-7" type="submit">
              Save Group
            </Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export { CreateGroupForm };
