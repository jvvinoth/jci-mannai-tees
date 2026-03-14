import { useState, useEffect } from "react";
import { getMembers, updateMember, maskPhone, type TShirtSize, type Member } from "@/lib/members";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

const SIZES: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface SubmissionListProps {
  onViewAll?: () => void;
  refreshKey?: number;
}

const SubmissionList = ({ onViewAll, refreshKey }: SubmissionListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editSize, setEditSize] = useState<TShirtSize>("L");
  const [members, setMembers] = useState<Member[]>([]);

  const loadMembers = async () => {
    const data = await getMembers();
    setMembers(data);
  };
  useEffect(() => { loadMembers(); }, [refreshKey]);

  const submitted = members.filter(m => m.is_submitted);
  if (submitted.length === 0) {
    return (<div className="text-center py-8 text-muted-foreground"><p>No submissions yet. Be the first!</p></div>);
  }

  const displayItems = submitted.slice(0, 5);

  const startEdit = (m: Member) => { setEditingId(m.id); setEditName(m.name); setEditPhone(m.phone_number); setEditSize(m.tshirt_size || 'L'); };

  const saveEdit = async (id: string) => {
    const trimmedName = editName.trim().slice(0, 100);
    const cleanedPhone = editPhone.replace(/[^\d+\-\s()]/g, '').trim().slice(0, 20);
    if (!trimmedName) { toast.error("Name cannot be empty"); return; }
    await updateMember(id, { name: trimmedName, phone_number: cleanedPhone, tshirt_size: editSize });
    setEditingId(null);
    await loadMembers();
    toast.success("Member updated!");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Submissions</h3>
        <span className="text-xs text-muted-foreground">{submitted.length} total</span>
      </div>
      <div className="space-y-2">
        {displayItems.map((m) => (
          <div key={m.id} className="p-3 bg-card rounded-xl border border-border space-y-2">
            {editingId === m.id ? (
              <div className="space-y-3">
                <div><label className="text-xs text-muted-foreground mb-1 block">Name</label><Input value={editName} onChange={e => setEditName(e.target.value)} className="h-9 text-sm" maxLength={100} /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Phone Number</label><Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="Enter phone number" className="h-9 text-sm" maxLength={20} /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">T-Shirt Size</label>
                  <div className="flex gap-2 flex-wrap">{SIZES.map(s => (<Button key={s} size="sm" variant={editSize === s ? "default" : "outline"} onClick={() => setEditSize(s)} className="text-xs h-8 px-3">{s}</Button>))}</div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="gap-1"><X className="h-3.5 w-3.5" /> Cancel</Button>
                  <Button size="sm" onClick={() => saveEdit(m.id)} className="gap-1"><Check className="h-3.5 w-3.5" /> Save</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm text-card-foreground">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.phone_number ? maskPhone(m.phone_number) : "No phone"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-bold text-sm text-primary">{m.tshirt_size}</div>
                    {m.submitted_at && (<div className="text-xs text-muted-foreground">{format(new Date(m.submitted_at), "MMM d, h:mm a")}</div>)}
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(m)}>
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {submitted.length > 5 && onViewAll && (
        <Button
          variant="default"
          className="w-full h-12 text-base font-semibold gap-2 rounded-xl shadow-md active:scale-95 transition-transform"
          onClick={onViewAll}
        >
          View All {submitted.length} Submissions
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      )}
    </div>
  );
};

export default SubmissionList;
