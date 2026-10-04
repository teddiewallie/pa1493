"use client";

import { CircleArrowLeft } from "lucide-react";

import Link from "next/link";

import {
  Field,
  FieldGroup,
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

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { saveArticle } from "@/service/save-article";
import { createArticleSchema } from "@/schema/article-schema";

import { MarkdownEditor } from "@/components/markdown-editor";

import { EquipmentContext } from "@/context/equipment-context";

const CreateArticleForm = ({ onSuccess, onFail, article, articleTypes, typeId, articleId, groupId, itemId, userId, isStudent }) => {
  const router = useRouter();
  const { items, groups } = useContext(EquipmentContext);
  const schema = createArticleSchema();

  const item = items.find((item) => (item.id == itemId));
  const group = groups.find((group) => (group.id == groupId));

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      id: article?.id ?? articleId,
      title: article?.title ?? "",
      content: article?.content ?? "",
      typeId: typeId ?? article?.type_id ?? articleTypes[0]?.id,
      groupId,
      itemId,
      userId
    }
  });

  useEffect(() => {
  if (!article) return;

  form.reset({
    id: article.id ?? articleId,
    title: article.title ?? "",
    content: article.content ?? "",
    typeId: typeId ?? article.type_id ?? articleTypes[0]?.id,
    groupId,
    itemId,
    userId
  });
}, [articleId, article, articleTypes, groupId, itemId, typeId, form]);

  const handleSubmit = async (data) => {
    const result = await saveArticle(data);
    result ? onSuccess(result) : onFail()
  };

  return (
    <>
      <div className="ml-2 my-4 font-bold">
        {item && (
          <Link
            className="cursor-pointer flex items-center"
            href={`/units/by-id/${item.id}`}
          >
            <CircleArrowLeft className="inline mr-2" />
            {item.name} - {item.serial}
          </Link>
        )}

        {group && (
          <Link
            className="cursor-pointer flex items-center"
            href={`/units/by-type/${group.id}`}
          >
            <CircleArrowLeft className="inline mr-2" />
            {group.name}
          </Link>
        )}
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        autoComplete="off"
        className="flex h-[calc(100vh-8rem)] flex-col"
      >
        <FieldSet className="flex min-h-0 flex-1 flex-col">
          <FieldGroup className="flex min-h-0 flex-1 flex-col">

            <div className="flex items-start">

              <Field
                className="flex-1"
                data-invalid={Boolean(form.formState.errors.title)}
              >
                <Input
                  id="title"
                  type="text"
                  placeholder="Title"
                  {...form.register("title")}
                  aria-invalid={Boolean(form.formState.errors.title)}
                  className="rounded-none border-b-0 -mb-5 !text-xl px-4 py-6 !bg-transparent"
                />
              </Field>

              { !isStudent && <Controller
                name="typeId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className="w-48"
                    data-invalid={fieldState.invalid}
                  >
                    <Select
                      value={field.value?.toString() ?? ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className="rounded-none border-0 !bg-transparent mt-2 -mb-5"
                      >
                        <SelectValue>
                          {articleTypes.find(
                            (type) => type.id === field.value
                          )?.name ?? "Article type"}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {articleTypes.map((type) => (
                          <SelectItem
                            key={type.id}
                            value={type.id.toString()}
                          >
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              /> }

            </div>

            <Field
              className="min-h-0 flex-1"
              data-invalid={Boolean(form.formState.errors.content)}
            >
              <Controller
                name="content"
                control={form.control}
                render={({ field }) => (
                  <MarkdownEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Field>

            <div className="flex items-center mx-2">
              <Button className="ml-auto" type="submit">
                Save Article
              </Button>
            </div>

          </FieldGroup>
        </FieldSet>
      </form>
    </>
  );
};

export { CreateArticleForm };
