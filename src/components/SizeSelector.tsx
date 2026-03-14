import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { TShirtSize, Member } from "@/lib/members";
import { submitSize } from "@/lib/members";

const SIZES: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface SizeSelectorProps {
  member: Member;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onBack: () => void;
}

const SizeSelector = ({ member, onSuccess, onError, onBack }: SizeSelectorProps) => {
  const [selected, setSelected] = useState<TShirtSize | null>(null);

  const handleSubmit = () => {
    if (!selected) return;
    const result = submitSize(member.id, selected);
    if (result.success) {
      onSuccess(result.message);
    } else {
      onError(result.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-foreground">Select Your Size</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Submitting for <span className="font-semibold text-foreground">{member.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SIZES.map((size, i) => (
          <motion.button
            key={size}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(size)}
            className={`h-16 w-full rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-all ${
              selected === size
                ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                : 'border-border bg-card text-card-foreground hover:border-primary/40'
            }`}
          >
            {size}
          </motion.button>
        ))}
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full h-14 text-base font-bold rounded-xl"
        >
          Submit Size
        </Button>
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full text-muted-foreground"
        >
          ← Back
        </Button>
      </div>
    </motion.div>
  );
};

export default SizeSelector;
