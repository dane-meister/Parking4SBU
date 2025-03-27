import '../stylesheets/index.css';
import '../stylesheets/CurrentReservation.css';

import ReservationItem from '../components/CurrentReservationItem';

export default function CurrentReservationsPage() {
    // Dummy data representing reservations (can be replaced with API data in the future)
    const reservations = [
        {
            id: 1,
            lotName: "Lot 40 (South P)", // Name of the parking lot
            date: "04/15/2025", // Reservation date
            time: "10:00 AM - 2:00 PM", // Reserved time slot
            permitNumber: "802250", // Associated permit number
            status: "Active" // Current status of the reservation
        },
        {
            id: 2,
            lotName: "West Campus Admin Garage", // Name of the parking lot
            date: "04/18/2025", // Reservation date
            time: "8:00 AM - 5:00 PM", // Reserved time slot
            permitNumber: "802251", // Associated permit number
            status: "Upcoming" // Current status of the reservation
        },
    ];

    return (
        <>
            {/* Main container for the reservations page */}
            <main className="reservation-page">
                {/* Page title */}
                <h1>My Reservations</h1>
                {/* Render a list of ReservationItem components for each reservation */}
                {reservations.map(reservation => (
                    <ReservationItem key={reservation.id} reservation={reservation} />
                ))}
            </main>
        </>
    );
}
