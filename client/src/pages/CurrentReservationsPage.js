import '../stylesheets/index.css';
import '../stylesheets/CurrentReservation.css';

import ReservationItem from '../components/CurrentReservationItem';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const HOST = "http://localhost:8000";

export default function CurrentReservationsPage() {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        if (!user?.user_id) return;

        axios.get(`${HOST}/api/reservations/${user.user_id}`, { withCredentials: true })
            .then(res => {
                const formatted = res.data.reservations.map(r => ({
                    id: r.id,
                    lotName: r.ParkingLot?.name || 'Unknown Lot',
                    date: new Date(r.start_time).toLocaleDateString(),
                    time: `${new Date(r.start_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })} - ${new Date(r.end_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}`,
                    licensePlate: r.Vehicle?.plate || 'N/A', // 🔄 Renamed from permitNumber
                    reservationId: r.id, // ✅ New field for true reservation ID
                    status: getStatus(r.start_time, r.end_time)
                }));
                setReservations(formatted);
            })
            .catch(err => console.error("Failed to fetch reservations", err));
    }, [user]);

    function getStatus(start, end) {
        const now = new Date();
        const startTime = new Date(start);
        const endTime = new Date(end);

        if (now < startTime) return 'Upcoming';
        if (now >= startTime && now <= endTime) return 'Active';
        return 'Past';
    }

    return (
        <main className="reservation-page">
            <h1>My Reservations</h1>
            {reservations.map(reservation => (
                <ReservationItem key={reservation.id} reservation={reservation} />
            ))}
        </main>
    );
}
