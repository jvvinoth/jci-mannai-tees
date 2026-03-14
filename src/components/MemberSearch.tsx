import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findMember, addManualMember, type Member } from "@/lib/members";

interface MemberSearchProps {
  onSelect: (member: Member) => void;
}

const MemberSearch = ({ onSelect }: MemberSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Member[]>([]);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length >= 2) {
      setResults(findMember(q));
    } else {
      setResults([]);
    }
  };

  const handleManualSubmit = () => {
    if (!manualName.trim() || !manualPhone.trim()) return;
    const member = addManualMember(manualName.trim(), manualPhone.trim());
    onSelect(member);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-foreground">Find Your Name</h2>
      <p className="text-sm text-muted-foreground">Search by name or phone number</p>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          className="h-12 pl-10 rounded-lg text-base"
          placeholder="Search name or phone..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          autoFocus
        />
      </div>

      <AnimatePresence mode="wait">
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2 max-h-60 overflow-y-auto"
          >
            {results.map((member) => (
              <button
                key={member.id}
                onClick={() => onSelect(member)}
                className="w-full text-left p-4 bg-card rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="font-semibold text-card-foreground">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.phone_number}</div>
                {member.is_submitted && (
                  <div className="text-xs text-accent font-medium mt-1">✓ Already submitted</div>
                )}
              </button>
            ))}
          </motion.div>
        )}

        {query.trim().length >= 2 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4"
          >
            <p className="text-sm text-muted-foreground mb-3">No member found</p>
            {!showManual && (
              <Button
                variant="outline"
                onClick={() => setShowManual(true)}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add Manually
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showManual && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 p-4 bg-card rounded-xl border border-border"
        >
          <h3 className="font-semibold text-card-foreground">Manual Entry</h3>
          <Input
            className="h-12 rounded-lg text-base"
            placeholder="Full Name"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
          />
          <Input
            className="h-12 rounded-lg text-base"
            placeholder="Phone Number"
            value={manualPhone}
            onChange={(e) => setManualPhone(e.target.value)}
          />
          <Button onClick={handleManualSubmit} className="w-full h-12 text-base font-semibold">
            Continue
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MemberSearch;
