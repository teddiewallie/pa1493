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
import { Textarea } from "@/components/ui/textarea";

import { saveGroup } from "@/service/save-group";
import { deleteGroup } from "@/service/delete-group";
import { createGroupSchema } from "@/schema/group-schema";

const CreateGroupForm = ({ onSuccess, onFail, onDeleteSuccess, onDeleteFail, group, groupId }) => {
  const schema = createGroupSchema();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      id: group?.id ?? groupId,
      name: group?.name ?? "",
      description: group?.description ?? "",
      knownIssues: group?.known_issues ?? ""
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

          <Field data-invalid={Boolean(form.formState.errors.knownIssues)}>
            <FieldLabel htmlFor="knownIssues">Known Issues</FieldLabel>
            <Textarea
              id="knownIssues"
              placeholder="Known issues with this group"
              className="min-h-40"
              {...form.register("knownIssues")}
              aria-invalid={Boolean(form.formState.errors.knownIssues)}
            />
            <FieldError errors={[form.formState.errors.knownIssues]} />
          </Field>

          <div className="grid grid-cols-2 gap-6">
            <Button variant="destructive" onClick={async () => {
              const result = await deleteGroup(group?.id);
              console.log(result);

              if (result) {
                onDeleteSuccess();
              } else {
                onDeleteFail();
              }
            }}>Delete Type</Button>
            <Button className="flex" type="submit">
              Save Type
            </Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export { CreateGroupForm };

