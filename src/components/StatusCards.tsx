import { motion } from "framer-motion";
import { Users, CheckCircle2, Clock } from "lucide-react";

interface StatusCardsProps {
  total: number;
  submitted: number;
}

const StatusCards = ({ total, submitted }: StatusCardsProps) => {
  const pending = total - submitted;
  const cards = [
    { label: "Total Members", value: total, icon: Users, color: "text-primary" },
    { label: "Submitted", value: submitted, icon: CheckCircle2, color: "text-accent" },
    { label: "Pending", value: pending, icon: Clock, color: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card p-4 rounded-2xl border border-border shadow-sm text-center"
        >
          <card.icon className={`mx-auto h-5 w-5 ${card.color} mb-2`} />
          <div className="text-2xl font-bold tabular-nums text-card-foreground">{card.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatusCards;
