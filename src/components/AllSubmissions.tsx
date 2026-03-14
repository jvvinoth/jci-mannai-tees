import { getMembers, maskPhone } from "@/lib/members";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface AllSubmissionsProps {
  onBack: () => void;
}

const AllSubmissions = ({ onBack }: AllSubmissionsProps) => {
  const submitted = getMembers().filter(m => m.is_submitted);

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

      <div className="space-y-2">
        {submitted.map((m, i) => (
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
      </div>
    </motion.div>
  );
};

export default AllSubmissions;
