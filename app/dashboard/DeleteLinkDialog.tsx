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
import { deleteLink } from "./actions";

interface DeleteLinkDialogProps {
  link: {
    id: number;
    code: string;
  };
  children?: React.ReactNode;
}

export function DeleteLinkDialog({ link, children }: DeleteLinkDialogProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const handleDelete = (): void => {
    setError("");

    startTransition(async () => {
      const result = await deleteLink({ id: link.id });

      if (result.success) {
        // Close dialog on success
        setOpen(false);
      } else {
        setError(result.error);
      }
    });
  };

  const handleOpenChange = (newOpen: boolean): void => {
    setOpen(newOpen);
    if (newOpen) {
      // Reset error when opening
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || <Button variant="destructive" size="sm">Delete</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this link? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              {error}
            </div>
          )}
          <div className="bg-muted rounded-md p-4">
            <p className="text-sm font-medium mb-1">Link Code:</p>
            <p className="text-sm font-mono">/{link.code}</p>
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
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
