import { useState } from "react";
import { getMembers, maskPhone, updateMemberPhone, type TShirtSize } from "@/lib/members";
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
  const [phoneInput, setPhoneInput] = useState("");
  const [, setRefresh] = useState(0);

  const submitted = getMembers().filter(m => m.is_submitted);

  const filtered = submitted.filter(m => {
    const matchesSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
    const matchesSize = sizeFilter === "ALL" || m.tshirt_size === sizeFilter;
    return matchesSearch && matchesSize;
  });

  const startEdit = (id: string, currentPhone: string) => {
    setEditingId(id);
    setPhoneInput(currentPhone);
  };

  const savePhone = (id: string) => {
    const cleaned = phoneInput.replace(/[^\d+\-\s()]/g, '').trim();
    if (cleaned.length > 20) {
      toast.error("Phone number is too long");
      return;
    }
    updateMemberPhone(id, cleaned);
    setEditingId(null);
    setPhoneInput("");
    setRefresh(r => r + 1);
    toast.success("Phone number updated!");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPhoneInput("");
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
          <div
            key={m.id}
            className="p-3 bg-card rounded-xl border border-border space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-6 text-right">{i + 1}.</span>
                <div className="font-medium text-sm text-card-foreground">{m.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold text-sm text-primary">{m.tshirt_size}</div>
                {editingId !== m.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => startEdit(m.id, m.phone_number)}
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </div>

            {editingId === m.id ? (
              <div className="flex items-center gap-2 pl-9">
                <Input
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  placeholder="Enter phone number"
                  className="h-8 text-sm"
                  maxLength={20}
                />
                <Button size="icon" className="h-8 w-8 shrink-0" onClick={() => savePhone(m.id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between pl-9">
                <div className="text-xs text-muted-foreground">
                  {m.phone_number ? maskPhone(m.phone_number) : "No phone number"}
                </div>
                {m.submitted_at && (
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(m.submitted_at), "MMM d, h:mm a")}
                  </div>
                )}
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
