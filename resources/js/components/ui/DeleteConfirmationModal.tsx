import { Dialog } from '@headlessui/react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6 shadow-lg">
                    <Dialog.Title className="text-lg font-bold">Confirm Deletion</Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm text-gray-600">
                        Are you sure you want to delete this todo? This action cannot be undone.
                    </Dialog.Description>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={onConfirm}>
                            Delete
                        </Button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 