import { motion } from "framer-motion";
import { RiskMeterProps } from "../types/apiTypes";

export const RiskMeter = ({ score, level }: RiskMeterProps) => {
  const getColor = () => {
    switch (level) {
      case "HIGH":
        return "#ff4444";
      case "MEDIUM":
        return "#ffaa44";
      case "LOW":
        return "#00ff9d";
      default:
        if (score > 75) return "#ff4444";
        if (score > 50) return "#ffaa44";
        if (score > 25) return "#ffdd44";
        return "#00ff9d";
    }
  };

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />
        <motion.path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={getColor()}
          strokeWidth="3"
          strokeDasharray={`${score}, 100`}
          initial={{ strokeDasharray: "0, 100" }}
          animate={{ strokeDasharray: `${score}, 100` }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 6px ${getColor()})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-lg font-bold font-mono"
          style={{ color: getColor() }}
        >
          {score}%
        </span>
      </div>
    </div>
  );
};
