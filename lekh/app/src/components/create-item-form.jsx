// https://ui.shadcn.com/docs/components/base/field
// https://ui.shadcn.com/docs/components/base/select
// https://ui.shadcn.com/docs/forms/react-hook-form#Checkbox

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError
} from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { CreateItemReservationRadio } from "@/components/create-item-form/create-item-reservation-radio"; 

import { useContext } from "react";
import { EquipmentContext } from "@/context/equipment-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePicker } from "@/components/image-picker";

import { saveItem } from "@/service/save-item";

import { createItemSchema } from "@/schema/item-schema";

const CreateItemForm = ({ onSuccess, onFail, statuses, item, groupId }) => {
  const editing = Boolean(item);
  const { groups } = useContext(EquipmentContext);
  const schema = createItemSchema(groups, statuses, editing);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      id: item?.id,
      assetId: item?.asset_id,
      name: item?.name ?? "",
      serial: item?.serial ?? "",
      description: item?.description ?? "",
      knownIssues: item?.known_issues ?? "",
      shelf: item?.shelf ?? "",
      statusId: item?.status_id ?? Number(statuses[0]?.id),
      groupId: item?.group_id ?? groupId ?? 1,
      borrowable: Boolean(item?.borrowable),
      bookable: Boolean(item?.bookable)
    }
  });

  const handleSubmit = async (data) => (
    await saveItem(data) ? onSuccess() : onFail()
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
      <FieldSet>
        <FieldGroup>
          <Field data-invalid={Boolean(form.formState.errors.name)}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="name"
              placeholder="Raspberry PI 4"
              {...form.register("name")}
              aria-invalid={Boolean(form.formState.errors.name)}
            />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field data-invalid={Boolean(form.formState.errors.serial)}>
            <FieldLabel htmlFor="serial">Serial</FieldLabel>
            <Input
              id="serial"
              type="serial"
              placeholder="S3R1-A1"
              {...form.register("serial")}
              aria-invalid={Boolean(form.formState.errors.serial)}
            />
            <FieldError errors={[form.formState.errors.serial]} />
          </Field>

          <Field data-invalid={Boolean(form.formState.errors.description)}>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
              id="description"
              type="description"
              placeholder="description"
              {...form.register("description")}
              aria-invalid={Boolean(form.formState.errors.description)}
            />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <Field data-invalid={Boolean(form.formState.errors.knownIssues)}>
            <FieldLabel htmlFor="knownIssues">Known Issues</FieldLabel>
            <Textarea
              id="knownIssues"
              placeholder="Known issues with this unit"
              className="min-h-32"
              {...form.register("knownIssues")}
              aria-invalid={Boolean(form.formState.errors.knownIssues)}
            />
            <FieldError errors={[form.formState.errors.knownIssues]} />
          </Field>

          <Field data-invalid={Boolean(form.formState.errors.shelf)}>
            <FieldLabel htmlFor="shelf">Shelf</FieldLabel>
            <Input
              id="shelf"
              type="shelf"
              placeholder="shelf"
              {...form.register("shelf")}
              aria-invalid={Boolean(form.formState.errors.shelf)}
            />
            <FieldError errors={[form.formState.errors.shelf]} />
          </Field>

          <Controller
            name="statusId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Status</FieldLabel>

                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue>
                      {statuses.find(
                        (status) => status.id === field.value
                      )?.name}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem
                        key={status.id}
                        value={status.id.toString()}
                      >
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="groupId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Type</FieldLabel>

                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue>
                      {groups.find(
                        (group) => group.id === field.value
                      )?.name ?? "Select Type"}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {groups
                      .toSorted((group1, group2) =>
                        group1.name.localeCompare(group2.name)
                      )
                      .map((group) => (
                        <SelectItem
                          key={group.id}
                          value={group.id.toString()}
                        >
                          {group.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="image"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Image</FieldLabel>

                <ImagePicker
                  current={item ? `/api/asset/${item.asset_id}` : null}
                  onChange={(file) => {
                    field.onChange(file);
                    form.trigger("image");
                  }}
                />

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="borrowable"
            control={form.control}
            render={({ field, fieldState }) => (
              <CreateItemReservationRadio {...{ form, field, fieldState }} />
            )}
          />

          <div className="container flex items-center gap-12">
            <Button className="flex mt-7" type="submit">
              Save Unit
            </Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export { CreateItemForm };
