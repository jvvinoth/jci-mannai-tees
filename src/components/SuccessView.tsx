import { motion } from "framer-motion";
import { CheckCircle2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessViewProps {
  message: string;
  onReset: () => void;
}

const SuccessView = ({ message, onReset }: SuccessViewProps) => {
  const shareText = encodeURIComponent(
    "JCI Raja Mannargudi Members,\n\nPlease submit your T-shirt size using the link below:\n" +
    window.location.origin +
    "\n\nThank you!\nPowered by Mannai Turf50"
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <CheckCircle2 className="mx-auto h-20 w-20 text-accent" />
      </motion.div>

      <div>
        <h2 className="text-2xl font-bold text-foreground">Got it!</h2>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>

      <div className="space-y-3">
        <Button
          asChild
          className="w-full h-14 text-base font-bold rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share on WhatsApp
          </a>
        </Button>
        <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
          Back to Home
        </Button>
      </div>
    </motion.div>
  );
};

export default SuccessView;
