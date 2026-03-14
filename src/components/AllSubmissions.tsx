import { useState } from "react";
import { getMembers, maskPhone, type TShirtSize } from "@/lib/members";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

const SIZES: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface AllSubmissionsProps {
  onBack: () => void;
}

const AllSubmissions = ({ onBack }: AllSubmissionsProps) => {
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState<TShirtSize | "ALL">("ALL");

  const submitted = getMembers().filter(m => m.is_submitted);

  const filtered = submitted.filter(m => {
    const matchesSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
    const matchesSize = sizeFilter === "ALL" || m.tshirt_size === sizeFilter;
    return matchesSearch && matchesSize;
  });

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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Size Filter */}
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

      {/* Results count */}
      <p className="text-xs text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((m, i) => (
          <div
            key={m.id}
            className="flex items-center justify-between p-3 bg-card rounded-xl border border-border"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-6 text-right">{i + 1}.</span>
              <div>
                <div className="font-medium text-sm text-card-foreground">{m.name}</div>
                <div className="text-xs text-muted-foreground">{maskPhone(m.phone_number)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-sm text-primary">{m.tshirt_size}</div>
              {m.submitted_at && (
                <div className="text-xs text-muted-foreground">
                  {format(new Date(m.submitted_at), "MMM d, h:mm a")}
                </div>
              )}
            </div>
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
