import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet
} from "@/components/ui/field";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { addReport } from "@/service/save-item";
import { reportSchema } from "@/schema/report-schema";

const ReportItemForm = ({ onSuccess, onFail, item }) => {
  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      id: item.id,
      reportIssue: "",
      knownIssues: item.known_issues ?? ""
    }
  });

  const handleSubmit = async (data) => (
    await addReport(data) ? onSuccess() : onFail()
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
      <FieldSet>
        <FieldGroup>
          <Field data-invalid={Boolean(form.formState.errors.reportIssue)}>
            <Textarea
              id="reportIssue"
              placeholder="Describe a new issue with this unit"
              className="min-h-32"
              {...form.register("reportIssue")}
              aria-invalid={Boolean(form.formState.errors.reportIssue)}
            />

            <FieldError errors={[form.formState.errors.reportIssue]} />
          </Field>

          <Button type="submit" className="mt-4">
            Report Issue
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export { ReportItemForm };

