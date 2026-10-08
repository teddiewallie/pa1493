import { Card } from "@/components/ui/card";
import { CreateReservation } from "@/components/create-reservation";

const ReservationCard = ({ item, type }) => {
  return (
    <Card className="flex flex-row p-0 overflow-hidden print:hidden">
      <CreateReservation {...{ item, type }} />
    </Card>
  );
};

export { ReservationCard };

