"use client";

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

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { saveArticle } from "@/service/save-article";
import { createArticleSchema } from "@/schema/article-schema";

import { MarkdownEditor } from "@/components/markdown-editor";

const articleTypes = [
  { id: 1, name: "Guide" },
  { id: 2, name: "Troubleshooting" },
  { id: 3, name: "Reference" },
  { id: 4, name: "Documentation" }
];

const CreateArticleForm = ({ onSuccess, onFail, article, articleId }) => {
  const schema = createArticleSchema();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      id: article?.id ?? articleId,
      title: article?.title ?? "",
      content: article?.content ?? "",
      typeId: article?.type_id ?? articleTypes[0].id
    }
  });

  const handleSubmit = async (data) => (
    await saveArticle(data) ? onSuccess() : onFail()
  );

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      autoComplete="off"
      className="flex h-[calc(100vh-4rem)] flex-col"
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

            <Controller
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
            />

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
  );
};

export { CreateArticleForm };
