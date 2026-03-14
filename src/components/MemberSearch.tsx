import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findMember, addManualMember, updateMember, maskPhone, type Member, type TShirtSize } from "@/lib/members";
import { toast } from "sonner";

const SIZES: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface MemberSearchProps {
  onSelect: (member: Member) => void;
  onRefresh?: () => void;
}

const MemberSearch = ({ onSelect, onRefresh }: MemberSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Member[]>([]);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editSize, setEditSize] = useState<TShirtSize>("L");

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.trim().length >= 2) {
      const found = await findMember(q);
      setResults(found);
    } else {
      setResults([]);
    }
  };

  const refreshResults = async () => {
    if (query.trim().length >= 2) {
      const found = await findMember(query);
      setResults(found);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualName.trim() || !manualPhone.trim()) return;
    const member = await addManualMember(manualName.trim(), manualPhone.trim());
    if (member) onSelect(member);
  };

  const startEdit = (m: Member) => {
    setEditingId(m.id);
    setEditName(m.name);
    setEditPhone(m.phone_number);
    setEditSize(m.tshirt_size || 'L');
  };

  const saveEdit = async (id: string) => {
    const trimmedName = editName.trim().slice(0, 100);
    const cleanedPhone = editPhone.replace(/[^\d+\-\s()]/g, '').trim().slice(0, 20);
    if (!trimmedName) { toast.error("Name cannot be empty"); return; }
    await updateMember(id, { name: trimmedName, phone_number: cleanedPhone, tshirt_size: editSize });
    setEditingId(null);
    await refreshResults();
    onRefresh?.();
    toast.success("Member updated!");
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Find Your Name</h2>
      <p className="text-sm text-muted-foreground">Search by name or phone number</p>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input className="h-12 pl-10 rounded-lg text-base" placeholder="Search name or phone..." value={query} onChange={(e) => handleSearch(e.target.value)} autoFocus />
      </div>
      <AnimatePresence mode="wait">
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2 max-h-[400px] overflow-y-auto">
            {results.map((member) => (
              <div key={member.id} className="bg-card rounded-xl border border-border overflow-hidden">
                {editingId === member.id ? (
                  <div className="p-4 space-y-3">
                    <div><label className="text-xs text-muted-foreground mb-1 block">Name</label><Input value={editName} onChange={e => setEditName(e.target.value)} className="h-9 text-sm" maxLength={100} /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Phone Number</label><Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="Enter phone number" className="h-9 text-sm" maxLength={20} /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">T-Shirt Size</label>
                      <div className="flex gap-2 flex-wrap">{SIZES.map(s => (<Button key={s} size="sm" variant={editSize === s ? "default" : "outline"} onClick={() => setEditSize(s)} className="text-xs h-8 px-3">{s}</Button>))}</div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={cancelEdit} className="gap-1"><X className="h-3.5 w-3.5" /> Cancel</Button>
                      <Button size="sm" onClick={() => saveEdit(member.id)} className="gap-1"><Check className="h-3.5 w-3.5" /> Save</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4">
                    <button onClick={() => !member.is_submitted && onSelect(member)} className="flex-1 text-left">
                      <div className="font-semibold text-card-foreground">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.phone_number ? maskPhone(member.phone_number) : "No phone"}</div>
                      {member.is_submitted && (<div className="text-xs font-medium mt-1 text-primary">✓ Submitted: {member.tshirt_size}</div>)}
                    </button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => startEdit(member)}>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
        {query.trim().length >= 2 && results.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">No member found</p>
            {!showManual && (<Button variant="outline" onClick={() => setShowManual(true)} className="gap-2"><UserPlus className="h-4 w-4" /> Add Manually</Button>)}
          </motion.div>
        )}
      </AnimatePresence>
      {showManual && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 p-4 bg-card rounded-xl border border-border">
          <h3 className="font-semibold text-card-foreground">Manual Entry</h3>
          <Input className="h-12 rounded-lg text-base" placeholder="Full Name" value={manualName} onChange={(e) => setManualName(e.target.value)} />
          <Input className="h-12 rounded-lg text-base" placeholder="Phone Number" value={manualPhone} onChange={(e) => setManualPhone(e.target.value)} />
          <Button onClick={handleManualSubmit} className="w-full h-12 text-base font-semibold">Continue</Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MemberSearch;
