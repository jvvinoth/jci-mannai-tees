import { getMembers, maskPhone } from "@/lib/members";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface SubmissionListProps {
  onViewAll?: () => void;
}

const SubmissionList = ({ onViewAll }: SubmissionListProps) => {
  const submitted = getMembers().filter(m => m.is_submitted);

  if (submitted.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No submissions yet. Be the first!</p>
      </div>
    );
  }

  const displayItems = submitted.slice(0, 10);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Submissions</h3>
        <span className="text-xs text-muted-foreground">{submitted.length} total</span>
      </div>
      <div className="space-y-2">
        {displayItems.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between p-3 bg-card rounded-xl border border-border"
          >
            <div>
              <div className="font-medium text-sm text-card-foreground">{m.name}</div>
              <div className="text-xs text-muted-foreground">{maskPhone(m.phone_number)}</div>
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
      {submitted.length > 10 && onViewAll && (
        <Button variant="outline" className="w-full gap-1" onClick={onViewAll}>
          View All ({submitted.length}) <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SubmissionList;
