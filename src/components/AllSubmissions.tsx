import { useState } from "react";
import { getMembers, maskPhone, saveMembers, type TShirtSize, type Member } from "@/lib/members";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Pencil, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const SIZES: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface AllSubmissionsProps {
  onBack: () => void;
}

const AllSubmissions = ({ onBack }: AllSubmissionsProps) => {
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState<TShirtSize | "ALL">("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editSize, setEditSize] = useState<TShirtSize>("L");
  const [, setRefresh] = useState(0);

  const submitted = getMembers().filter(m => m.is_submitted);

  const filtered = submitted.filter(m => {
    const matchesSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
    const matchesSize = sizeFilter === "ALL" || m.tshirt_size === sizeFilter;
    return matchesSearch && matchesSize;
  });

  const startEdit = (m: Member) => {
    setEditingId(m.id);
    setEditName(m.name);
    setEditPhone(m.phone_number);
    setEditSize(m.tshirt_size || 'L');
  };

  const saveEdit = (id: string) => {
    const trimmedName = editName.trim().slice(0, 100);
    const cleanedPhone = editPhone.replace(/[^\d+\-\s()]/g, '').trim().slice(0, 20);
    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }
    const members = getMembers();
    const idx = members.findIndex(m => m.id === id);
    if (idx !== -1) {
      members[idx].name = trimmedName;
      members[idx].phone_number = cleanedPhone;
      members[idx].tshirt_size = editSize;
      saveMembers(members);
    }
    setEditingId(null);
    setRefresh(r => r + 1);
    toast.success("Member updated!");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold text-foreground">All Submissions ({submitted.length})</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={sizeFilter === "ALL" ? "default" : "outline"}
          onClick={() => setSizeFilter("ALL")}
          className="text-xs h-8"
        >
          All
        </Button>
        {SIZES.map(s => (
          <Button
            key={s}
            size="sm"
            variant={sizeFilter === s ? "default" : "outline"}
            onClick={() => setSizeFilter(s)}
            className="text-xs h-8"
          >
            {s}
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>

      <div className="space-y-2">
        {filtered.map((m, i) => (
          <div key={m.id} className="p-3 bg-card rounded-xl border border-border space-y-2">
            {editingId === m.id ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                  <Input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="h-9 text-sm"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Phone Number</label>
                  <Input
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="h-9 text-sm"
                    maxLength={20}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">T-Shirt Size</label>
                  <div className="flex gap-2 flex-wrap">
                    {SIZES.map(s => (
                      <Button
                        key={s}
                        size="sm"
                        variant={editSize === s ? "default" : "outline"}
                        onClick={() => setEditSize(s)}
                        className="text-xs h-8 px-3"
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="ghost" onClick={cancelEdit} className="gap-1">
                    <X className="h-3.5 w-3.5" /> Cancel
                  </Button>
                  <Button size="sm" onClick={() => saveEdit(m.id)} className="gap-1">
                    <Check className="h-3.5 w-3.5" /> Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-6 text-right">{i + 1}.</span>
                  <div>
                    <div className="font-medium text-sm text-card-foreground">{m.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.phone_number ? maskPhone(m.phone_number) : "No phone"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-bold text-sm text-primary">{m.tshirt_size}</div>
                    {m.submitted_at && (
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(m.submitted_at), "MMM d, h:mm a")}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => startEdit(m)}
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-6 text-sm">No matching submissions found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default AllSubmissions;
