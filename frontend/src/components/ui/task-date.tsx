import { differenceInDays, format } from "date-fns";

import { cn } from "@/lib/utils";

interface TaskDateProps {
  value: string;
  className?: string;
};

export const TaskDate = ({ value, className }: TaskDateProps) => {
  const today = new Date();
  const endDate = new Date(value);
  const diffInDays = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";
  if (diffInDays <= 3) {
    textColor = "text-destructive";
  } else if (diffInDays <= 7) {
    textColor = "text-orange";
  } else if (diffInDays <= 14) {
    textColor = "text-yellow";
  }

  return (
    <div className={textColor}>
      <span className={cn("truncate", className)}>
        {format(value, "PPP")}
      </span>
    </div>
  );
};

