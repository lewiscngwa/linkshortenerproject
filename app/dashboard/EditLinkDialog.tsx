"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateLink } from "./actions";

interface EditLinkDialogProps {
  link: {
    id: number;
    code: string;
    destinationUrl: string;
  };
  children?: React.ReactNode;
}

export function EditLinkDialog({ link, children }: EditLinkDialogProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [destinationUrl, setDestinationUrl] = useState(link.destinationUrl);
  const [code, setCode] = useState(link.code);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    startTransition(async () => {
      const result = await updateLink({
        id: link.id,
        destinationUrl,
        code,
      });

      if (result.success) {
        // Close dialog on success
        setOpen(false);
      } else {
        setError(result.error);
        if (result.details) {
          setFieldErrors(result.details);
        }
      }
    });
  };

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean): void => {
    setOpen(newOpen);
    if (newOpen) {
      // Reset to original values when opening
      setDestinationUrl(link.destinationUrl);
      setCode(link.code);
      setError("");
      setFieldErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || <Button variant="outline" size="sm">Edit</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Short Link</DialogTitle>
            <DialogDescription>
              Update the destination URL or custom code for this link.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="edit-destinationUrl">
                Destination URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-destinationUrl"
                type="url"
                placeholder="https://example.com"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                disabled={isPending}
                required
                aria-invalid={!!fieldErrors.destinationUrl}
                aria-describedby={
                  fieldErrors.destinationUrl ? "edit-destinationUrl-error" : undefined
                }
              />
              {fieldErrors.destinationUrl && (
                <p id="edit-destinationUrl-error" className="text-sm text-red-600">
                  {fieldErrors.destinationUrl[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-code">
                Custom Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-code"
                type="text"
                placeholder="my-custom-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isPending}
                required
                aria-invalid={!!fieldErrors.code}
                aria-describedby={fieldErrors.code ? "edit-code-error" : undefined}
              />
              {fieldErrors.code && (
                <p id="edit-code-error" className="text-sm text-red-600">
                  {fieldErrors.code[0]}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
