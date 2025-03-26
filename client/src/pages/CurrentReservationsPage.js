import '../stylesheets/index.css';
import '../stylesheets/CurrentReservation.css';

import ReservationItem from '../components/CurrentReservationItem';

export default function CurrentReservationsPage() {
  // Dummy data (easily replaceable with fetched API data later)
  const reservations = [
    {
      id: 1,
      lotName: "Lot 40 (South P)",
      date: "04/15/2025",
      time: "10:00 AM - 2:00 PM",
      permitNumber: "802250",
      status: "Active"
    },
    {
      id: 2,
      lotName: "West Campus Admin Garage",
      date: "04/18/2025",
      time: "8:00 AM - 5:00 PM",
      permitNumber: "802251",
      status: "Upcoming"
    },
  ];

  return (
    <>
      <main className="reservation-page">
        <h1>My Reservations</h1>
        {reservations.map(reservation => (
          <ReservationItem key={reservation.id} reservation={reservation} />
        ))}
      </main>
    </>
  );
}
