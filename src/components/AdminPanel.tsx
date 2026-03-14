import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Download, Edit2, Check, X, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getMembers, updateMemberSize, updateMemberStatus, bulkUpdateStatus, exportCSV,
  type TShirtSize, type Member, type OrderStatus, ORDER_STATUSES,
} from "@/lib/members";

const ADMIN_PASS = "mannai2026";
const SIZES: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface AdminPanelProps {
  onClose: () => void;
}

const StatusBadge = ({ status, onChange }: { status: OrderStatus; onChange: (s: OrderStatus) => void }) => {
  const cfg = ORDER_STATUSES.find(s => s.value === status)!;
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border-none outline-none cursor-pointer ${cfg.color}`}
    >
      {ORDER_STATUSES.map(s => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
};

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSize, setEditSize] = useState<TShirtSize | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const loadMembers = async () => {
    const data = await getMembers();
    setMembers(data);
  };

  useEffect(() => { if (authed) loadMembers(); }, [authed]);

  const handleAuth = () => {
    if (pass === ADMIN_PASS) setAuthed(true);
  };

  const handleSave = async (id: string) => {
    if (editSize) {
      await updateMemberSize(id, editSize);
      await loadMembers();
    }
    setEditingId(null);
    setEditSize(null);
  };

  const handleExport = async () => {
    const csv = await exportCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jci-mannai-tshirt-sizes.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkStatus = async (status: OrderStatus) => {
    const label = ORDER_STATUSES.find(s => s.value === status)!.label;
    const count = members.filter(m => m.is_submitted).length;
    await bulkUpdateStatus(status);
    await loadMembers();
    toast.success(`All ${count} members set to "${label}"`);
  };

  const handleIndividualStatus = async (id: string, status: OrderStatus) => {
    await updateMemberStatus(id, status);
    await loadMembers();
  };

  if (!authed) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Lock className="h-5 w-5" /> Admin Access</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <Input type="password" className="h-12 rounded-lg text-base" placeholder="Enter admin password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAuth()} />
        <Button onClick={handleAuth} className="w-full h-12 text-base font-semibold">Unlock</Button>
      </motion.div>
    );
  }

  const submitted = members.filter(m => m.is_submitted);
  const filtered = filterStatus === 'all' ? submitted : submitted.filter(m => m.order_status === filterStatus);

  const statusCounts = ORDER_STATUSES.map(s => ({
    ...s,
    count: submitted.filter(m => m.order_status === s.value).length,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1"><Download className="h-4 w-4" /> CSV</Button>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {statusCounts.map(s => (
          <div key={s.value} className={`rounded-xl p-2 text-center ${s.color}`}>
            <div className="text-lg font-bold">{s.count}</div>
            <div className="text-[10px] font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Bulk Update All:</p>
        <div className="flex flex-wrap gap-1.5">
          {ORDER_STATUSES.map(s => (
            <button key={s.value} onClick={() => handleBulkStatus(s.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${s.color} hover:opacity-80 border border-border`}
            >Set All → {s.label}</button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <button onClick={() => setFilterStatus('all')}
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${filterStatus === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >All ({submitted.length})</button>
        {statusCounts.map(s => (
          <button key={s.value} onClick={() => setFilterStatus(s.value)}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${filterStatus === s.value ? 'bg-primary text-primary-foreground' : s.color}`}
          >{s.label} ({s.count})</button>
        ))}
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {filtered.length === 0 && (<p className="text-center text-muted-foreground py-4">No members found.</p>)}
        <AnimatePresence>
          {filtered.map((member) => (
            <motion.div key={member.id} layout className="flex items-center justify-between p-3 bg-card rounded-xl border border-border gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-card-foreground truncate">{member.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-bold text-primary">{member.tshirt_size}</span>
                  <StatusBadge status={member.order_status} onChange={(s) => handleIndividualStatus(member.id, s)} />
                </div>
              </div>
              {editingId === member.id ? (
                <div className="flex items-center gap-1">
                  <select className="h-8 px-2 rounded border border-border bg-card text-sm text-card-foreground" value={editSize || member.tshirt_size || ''} onChange={(e) => setEditSize(e.target.value as TShirtSize)}>
                    {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => handleSave(member.id)} className="p-1 text-accent"><Check className="h-4 w-4" /></button>
                  <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <button onClick={() => { setEditingId(member.id); setEditSize(member.tshirt_size); }} className="p-1 text-muted-foreground hover:text-foreground">
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
