import {
  CircleCheck,
  CircleMinus,
  CircleAlert,
  CircleX
} from "lucide-react";

const statusIcon = {
  "Available": { icon: CircleCheck, color: "text-green-500" },
  "Reserved": { icon: CircleMinus, color: "text-red-500" },
  "Borrowed": { icon: CircleMinus, color: "text-red-500" },
  "Unavailable": { icon: CircleMinus, color: "text-red-500" },
  "Booked": { icon: CircleMinus, color: "text-red-500" },
  "Overdue": { icon: CircleMinus, color: "text-red-500" },
  "In Repair": { icon: CircleAlert, color: "text-orange-500" },
  "Out of Service": { icon: CircleX, color: "text-red-500" },
  "Retired": { icon: CircleX, color: "text-red-500" }
};

const ItemStatus = ({ name, extra }) => {
  const Icon = statusIcon[name]?.icon || CircleX;

  return (
    <div className="flex print:hidden items-center justify-left mx-4">
      <div className="flex-1">Status</div>
      <div className="flex items-center">
        {extra && `${extra} - `}
        {name}
        <Icon className={`ml-2 ${statusIcon[name]?.color || "text-red-500"}`} />
      </div>
    </div>
  );
};

export { ItemStatus };

