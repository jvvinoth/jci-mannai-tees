import { motion } from "framer-motion";

interface ProgressBarProps {
  submitted: number;
  total: number;
}

const ProgressBar = ({ submitted, total }: ProgressBarProps) => {
  const pct = total > 0 ? (submitted / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-muted-foreground mb-1">
        <span>{submitted} of {total} submitted</span>
        <span className="tabular-nums font-medium">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
