import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Download, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMembers, updateMemberSize, exportCSV, type TShirtSize, type Member } from "@/lib/members";

const ADMIN_PASS = "mannai2026";
const SIZES: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSize, setEditSize] = useState<TShirtSize | null>(null);
  const [members, setMembers] = useState<Member[]>(getMembers());

  const handleAuth = () => {
    if (pass === ADMIN_PASS) setAuthed(true);
  };

  const handleSave = (id: string) => {
    if (editSize) {
      updateMemberSize(id, editSize);
      setMembers(getMembers());
    }
    setEditingId(null);
    setEditSize(null);
  };

  const handleExport = () => {
    const csv = exportCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jci-mannai-tshirt-sizes.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5" /> Admin Access
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <Input
          type="password"
          className="h-12 rounded-lg text-base"
          placeholder="Enter admin password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAuth()}
        />
        <Button onClick={handleAuth} className="w-full h-12 text-base font-semibold">
          Unlock
        </Button>
      </motion.div>
    );
  }

  const submitted = members.filter(m => m.is_submitted);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1">
            <Download className="h-4 w-4" /> CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {submitted.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No submissions yet.</p>
        )}
        <AnimatePresence>
          {submitted.map((m) => (
            <motion.div
              key={m.id}
              layout
              className="flex items-center justify-between p-3 bg-card rounded-xl border border-border"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-card-foreground truncate">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.phone_number}</div>
              </div>

              {editingId === m.id ? (
                <div className="flex items-center gap-1">
                  <select
                    className="h-8 px-2 rounded border border-border bg-card text-sm text-card-foreground"
                    value={editSize || m.tshirt_size || ''}
                    onChange={(e) => setEditSize(e.target.value as TShirtSize)}
                  >
                    {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => handleSave(m.id)} className="p-1 text-accent"><Check className="h-4 w-4" /></button>
                  <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-primary">{m.tshirt_size}</span>
                  <button
                    onClick={() => { setEditingId(m.id); setEditSize(m.tshirt_size); }}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
