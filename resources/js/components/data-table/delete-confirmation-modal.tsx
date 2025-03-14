import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    title: string;
    description: string;
    cancelButtonLabel?: string;
    confirmButtonLabel?: string;
    cancelButtonVariant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
    confirmButtonVariant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
    cancelButtonClassName?: string;
    confirmButtonClassName?: string;
    footerClassName?: string;
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    loading = false,
    title,
    description,
    cancelButtonLabel = "Cancel",
    confirmButtonLabel = "Delete",
    cancelButtonVariant = "secondary",
    confirmButtonVariant = "destructive",
    cancelButtonClassName,
    confirmButtonClassName,
    footerClassName,
}: DeleteConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className={cn("gap-4 sm:gap-2", footerClassName)}>
                    <Button
                        variant={cancelButtonVariant}
                        onClick={onClose}
                        disabled={loading}
                        className={cancelButtonClassName}
                    >
                        {cancelButtonLabel}
                    </Button>
                    <Button
                        variant={confirmButtonVariant}
                        onClick={onConfirm}
                        disabled={loading}
                        loading={loading}
                        className={confirmButtonClassName}
                    >
                        {confirmButtonLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 