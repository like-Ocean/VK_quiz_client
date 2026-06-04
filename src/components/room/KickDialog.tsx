import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent,
  DialogFooter, DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { KickReason } from "@/types/room";

interface KickDialogProps {
  target: { id: string; name: string } | null;
  reasons: KickReason[];
  selectedReason: string;
  comment: string;
  isPending: boolean;
  onReasonChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function KickDialog({
  target,
  reasons,
  selectedReason,
  comment,
  isPending,
  onReasonChange,
  onCommentChange,
  onConfirm,
  onClose,
}: KickDialogProps) {
  return (
    <Dialog open={!!target} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить {target?.name}?</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <label className="text-sm font-medium">Причина</label>
          <select
            className="border border-border rounded-md px-3 py-2 text-sm bg-background"
            value={selectedReason}
            onChange={(e) => onReasonChange(e.target.value)}
          >
            <option value="">Не указана</option>
            {reasons.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>

          <label className="text-sm font-medium">Комментарий (необязательно)</label>
          <input
            className="border border-border rounded-md px-3 py-2 text-sm bg-background"
            placeholder="Дополнительная информация..."
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Удаление...
              </>
            ) : (
              "Удалить"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}