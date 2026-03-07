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
import { createLink } from "./actions";

interface CreateLinkDialogProps {
  children?: React.ReactNode;
}

export function CreateLinkDialog({ children }: CreateLinkDialogProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [destinationUrl, setDestinationUrl] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    startTransition(async () => {
      const result = await createLink({
        destinationUrl,
        code: code.trim() || undefined,
      });

      if (result.success) {
        // Reset form and close dialog
        setDestinationUrl("");
        setCode("");
        setOpen(false);
      } else {
        setError(result.error);
        if (result.details) {
          setFieldErrors(result.details);
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Create Link</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Short Link</DialogTitle>
            <DialogDescription>
              Create a new short link. If you don&apos;t provide a custom code, one will
              be generated for you.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="destinationUrl">
                Destination URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="destinationUrl"
                type="url"
                placeholder="https://example.com"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                disabled={isPending}
                required
                aria-invalid={!!fieldErrors.destinationUrl}
                aria-describedby={
                  fieldErrors.destinationUrl ? "destinationUrl-error" : undefined
                }
              />
              {fieldErrors.destinationUrl && (
                <p id="destinationUrl-error" className="text-sm text-red-600">
                  {fieldErrors.destinationUrl[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Custom Code (optional)</Label>
              <Input
                id="code"
                type="text"
                placeholder="my-custom-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isPending}
                aria-invalid={!!fieldErrors.code}
                aria-describedby={fieldErrors.code ? "code-error" : undefined}
              />
              {fieldErrors.code && (
                <p id="code-error" className="text-sm text-red-600">
                  {fieldErrors.code[0]}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Leave blank to generate a random code automatically.
              </p>
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
              {isPending ? "Creating..." : "Create Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
