import { SimpleCard } from "@/components/simple-card";
import { format } from "date-fns";

const f = (date, showTime) => {
  const template = showTime ? "yyyyMMdd HH:mm" : "yyyyMMdd";
  return format(date, template);
}

const ReservationLine = ({reservation, showTime}) => (
  <div>
    <span className="font-mono">{`${f(reservation.start_at, showTime)}`}</span>
    {" - "}
    <span className="font-mono">{`${f(reservation.end_at, showTime)}`}</span>
  </div>
);

const ReservationHistoryCard = ({ reservations, showTime=false }) => {
  const content = reservations.map((reservation) => <ReservationLine
    key={`res-${reservation.id}`} {...{ reservation, showTime }} />);

  return (<SimpleCard {...{
    title: "Reservation History",
    description: "All the reservations for this unit.",
    maxHeight: 350,
    content
  }} />)
};

export { ReservationHistoryCard };
