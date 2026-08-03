import React, { FormEvent, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { Input } from "./Input";

export interface PromptDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title?: string;
  description?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  submitLabel?: string;
  loading?: boolean;
}

/**
 * Reusable single-field prompt modal (replaces window.prompt).
 * Calls onSubmit(trimmedValue) when confirmed.
 */
const PromptDialog: React.FC<PromptDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title = "Add",
  description,
  label,
  placeholder,
  defaultValue = "",
  submitLabel = "Add",
  loading = false,
}) => {
  const [value, setValue] = useState<string>(defaultValue);
  const submitted = useRef<boolean>(false);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      submitted.current = false;
    }
  }, [open, defaultValue]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = value.trim();
    if (!trimmed || submitted.current) return;

    submitted.current = true;
    onSubmit(trimmed);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label={label}
          placeholder={placeholder}
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
            disabled={!value.trim()}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PromptDialog;