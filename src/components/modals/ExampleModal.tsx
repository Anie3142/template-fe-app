'use client';

import * as Dialog from '@radix-ui/react-dialog';

export function ExampleModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">Example Modal</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">
            Replace this stub with your real modal content.
          </Dialog.Description>
          <Dialog.Close className="mt-4 rounded-md border px-3 py-1 text-sm">
            Close
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
