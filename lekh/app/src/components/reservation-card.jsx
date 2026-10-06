import { Card } from "@/components/ui/card";
import { CreateReservationForm } from "@/components/create-reservation-form";

const ReservationCard = ({ item, type }) => {
  return (
    <Card className="flex flex-row p-0 overflow-hidden print:hidden">
      <CreateReservationForm {...{ item, type }} />
    </Card>
  );
};

export { ReservationCard };

