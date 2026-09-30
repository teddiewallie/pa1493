import {
  CircleCheck,
  CircleMinus,
  CircleAlert,
  CircleX
} from "lucide-react";

const statusIcon = {
  1: { icon: CircleCheck, color: "text-green-500" },
  2: { icon: CircleMinus, color: "text-red-500" },
  3: { icon: CircleAlert, color: "text-orange-500" },
  4: { icon: CircleX, color: "text-red-500" },
  5: { icon: CircleX, color: "text-red-500" }
};

const ItemStatus = ({ id, name }) => {
  const Icon = statusIcon[id].icon;

  return (
    <div className="flex print:hidden items-center justify-left mx-4">
      <div className="flex-1">Status</div>
      <div className="flex items-center">
        {name}
        <Icon className={`ml-2 ${statusIcon[id].color}`} />
      </div>
    </div>
  );
};

export { ItemStatus };

