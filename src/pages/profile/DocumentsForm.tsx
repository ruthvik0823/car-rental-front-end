import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUploadInput from "../../components/common/FileUploadInput";
import { useState } from "react";

import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const documentsSchema = z.object({
  passportFront: z.instanceof(File).optional().refine(
    file => !file || file.size < MAX_FILE_SIZE, {
      message: "File must be less than 1 MB"
    }
  ),
  passportBack: z.instanceof(File).optional().refine(
    file => !file || file.size < MAX_FILE_SIZE, {
      message: "File must be less than 1 MB"
    }
  ),
  licenseFront: z.instanceof(File).optional().refine(
    file => !file || file.size < MAX_FILE_SIZE, {
      message: "File must be less than 1 MB"
    }
  ),
  licenseBack: z.instanceof(File).optional().refine(
    file => !file || file.size < MAX_FILE_SIZE, {
      message: "File must be less than 1 MB"
    }
  ),
});

type DocumentsFormValues = z.infer<typeof documentsSchema>;

function DocumentsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteFile, setDeleteFile] = useState<null | { field: string }>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<DocumentsFormValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      passportFront: undefined,
      passportBack: undefined,
      licenseFront: undefined,
      licenseBack: undefined,
    }
  });

  const files = watch();

  const handleFileRemove = (field: keyof DocumentsFormValues) => {
    setDeleteFile({ field });
  };

  const confirmFileRemove = () => {
    if (deleteFile) {
      setValue(deleteFile.field as keyof DocumentsFormValues, undefined);
      setDeleteFile(null);
    }
  };

  const onSubmit = (data: DocumentsFormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessToast(true);
    }, 1000);
  };

  return (
    <>
      <Toast
      type="success"
        message="Documents updated"
        subMessage="Your documents were updated successfully."
        isOpen={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
      <form className="max-w-2xl space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <section className="rounded-xl border p-6 bg-white mb-6">
          <h2 className="text-xl font-semibold mb-4">Passport details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="passportFront"
              control={control}
              render={({ field }) => (
                <FileUploadInput
                  label="Front side"
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={() => handleFileRemove("passportFront")}
                  error={errors.passportFront?.message}
                />
              )}
            />
            <Controller
              name="passportBack"
              control={control}
              render={({ field }) => (
                <FileUploadInput
                  label="Back side"
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={() => handleFileRemove("passportBack")}
                  error={errors.passportBack?.message}
                />
              )}
            />
          </div>
        </section>

        <section className="rounded-xl border p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Driving licence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="licenseFront"
              control={control}
              render={({ field }) => (
                <FileUploadInput
                  label="Front side"
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={() => handleFileRemove("licenseFront")}
                  error={errors.licenseFront?.message}
                />
              )}
            />
            <Controller
              name="licenseBack"
              control={control}
              render={({ field }) => (
                <FileUploadInput
                  label="Back side"
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={() => handleFileRemove("licenseBack")}
                  error={errors.licenseBack?.message}
                />
              )}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold shadow-sm hover:bg-red-700 transition"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </div>

        <Modal
          open={!!deleteFile}
          title="Delete document?"
          description="You are about to delete this document. Are you sure you want to proceed?"
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setDeleteFile(null)}
          onConfirm={confirmFileRemove}
        />
      </form>
    </>
  );
}

export default DocumentsForm;