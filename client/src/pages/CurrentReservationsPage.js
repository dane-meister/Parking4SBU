import '../stylesheets/index.css';
import '../stylesheets/CurrentReservation.css';

import ReservationItem from '../components/CurrentReservationItem';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// const HOST = "http://localhost:8000";
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; 

export default function CurrentReservationsPage() {
    const { user } = useAuth();
    const [activeReservations, setActiveReservations] = useState([]);
    const [pastReservations, setPastReservations] = useState([]);
    const [cancelledReservations, setCancelledReservations] = useState([]);
    const [otherReservations, setOtherReservations] = useState([]);

    useEffect(() => {
        if (!user?.user_id) return;

        axios.get(`${HOST}/api/reservations/${user.user_id}`, { withCredentials: true })
            .then(res => {
                const active = [];
                const past = [];
                const cancelled = [];
                const other = [];

                res.data.reservations.forEach(r => {
                    const start = new Date(r.start_time);
                    const end = new Date(r.end_time);
                    const now = new Date();
                    
                    let displayStatus = '';

                    if (r.status === 'cancelled') {
                        displayStatus = 'Cancelled';
                    } else if (r.status === 'pending') {
                        displayStatus = 'Pending';
                    } else if (r.status === 'confirmed') {
                        // Only if confirmed, calculate based on time
                        if (now < start) {
                            displayStatus = 'Upcoming';
                        } else if (now >= start && now <= end) {
                            displayStatus = 'Active';
                        } else {
                            displayStatus = 'Past';
                        }
                    } else {
                        // fallback catch (rare)
                        displayStatus = r.status.charAt(0).toUpperCase() + r.status.slice(1);
                    }

                    const formattedReservation = {
                        id: r.id,
                        lotName: r.ParkingLot?.name || 'Unknown Lot',
                        date: start.toLocaleDateString(),
                        time: `${start.toLocaleTimeString([], {
                            hour: '2-digit', minute: '2-digit'
                        })} - ${end.toLocaleTimeString([], {
                            hour: '2-digit', minute: '2-digit'
                        })}`,
                        licensePlate: r.Vehicle?.plate || 'N/A',
                        reservationId: r.id,
                        status: displayStatus,
                        spotCount: r.spot_count,
                        eventDescription: r.event_description
                    };

                    if (r.status === 'cancelled') {
                        cancelled.push(formattedReservation);
                    } else if (now > end) {
                        past.push(formattedReservation);
                    } else {
                        active.push(formattedReservation);
                    }
                });

                setActiveReservations(active);
                setPastReservations(past);
                setCancelledReservations(cancelled);
                setOtherReservations(other);
            })
            .catch(err => console.error("Failed to fetch reservations", err));
    }, [user]);

    return (
        <main className="reservation-page">
            <h1>My Reservations</h1>

            {activeReservations.length > 0 && (
                <>
                    <h2>Active/Upcoming Reservations</h2>
                    {activeReservations.map(reservation => (
                        <ReservationItem key={reservation.id} reservation={reservation} />
                    ))}
                </>
            )}

            {pastReservations.length > 0 && (
                <>
                    <h2>Past Reservations</h2>
                    {pastReservations.map(reservation => (
                        <ReservationItem key={reservation.id} reservation={reservation} />
                    ))}
                </>
            )}

            {cancelledReservations.length > 0 && (
                <>
                    <h2>Cancelled Reservations</h2>
                    {cancelledReservations.map(reservation => (
                        <ReservationItem key={reservation.id} reservation={reservation} />
                    ))}
                </>
            )}

            {activeReservations.length === 0 && pastReservations.length === 0 && cancelledReservations.length === 0 && (
                <p>No reservations found.</p>
            )}
        </main>
    );
}
