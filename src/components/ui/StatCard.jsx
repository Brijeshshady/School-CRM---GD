import { Card } from "./Card";
import { motion } from "motion/react";
import clsx from "clsx";

export const StatCard = ({
  label,
  value,
  change,
  trend,
  icon: Icon,
  color, // expected format: e.g., "bg-blue-500" or "text-blue-600 bg-blue-50"
  delay = 0,
  iconColorClassName = "text-white"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-6 h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-2">
                <span 
                  className={clsx(
                    "text-sm font-medium",
                    trend === "up" ? "text-green-600" : 
                    trend === "down" ? "text-red-600" : 
                    "text-slate-500"
                  )}
                >
                  {change}
                </span>
                {trend && <span className="text-xs text-slate-400">vs last period</span>}
              </div>
            )}
          </div>
          {Icon && (
            <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", color)}>
              <Icon className={clsx("w-6 h-6", iconColorClassName)} />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
