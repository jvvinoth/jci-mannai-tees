import { getMembers, maskPhone } from "@/lib/members";
import { format } from "date-fns";

const SubmissionList = () => {
  const submitted = getMembers().filter(m => m.is_submitted);

  if (submitted.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No submissions yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-foreground">Submissions</h3>
      <div className="space-y-2">
        {submitted.map((m) => (
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
    </div>
  );
};

export default SubmissionList;
