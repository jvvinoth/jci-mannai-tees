import { useState, useEffect } from "react";
import { getSizeDistribution, type TShirtSize } from "@/lib/members";
import { motion } from "framer-motion";

interface SizeChartProps {
  refreshKey?: number;
}

const SizeChart = ({ refreshKey }: SizeChartProps) => {
  const [dist, setDist] = useState<Record<TShirtSize, number>>({ S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 });
  const sizes: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  useEffect(() => {
    getSizeDistribution().then(setDist);
  }, [refreshKey]);

  const max = Math.max(...Object.values(dist), 1);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-foreground">Size Distribution</h3>
      <div className="space-y-2">
        {sizes.map((size) => (
          <div key={size} className="flex items-center gap-3">
            <span className="w-12 text-sm font-semibold text-foreground tabular-nums">{size}</span>
            <div className="flex-1 h-8 bg-secondary rounded-lg overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-lg flex items-center justify-end pr-2"
                initial={{ width: 0 }}
                animate={{ width: `${(dist[size] / max) * 100}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                {dist[size] > 0 && (
                  <span className="text-xs font-bold text-primary-foreground tabular-nums">{dist[size]}</span>
                )}
              </motion.div>
            </div>
            {dist[size] === 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">0</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SizeChart;
