import axios from 'axios';

const HOST = "http://localhost:8000";

export async function fetchLotAvailability(startISO, endISO) {
  try {
    const startDate = new Date(startISO);
    const endDate = new Date(endISO);

    if (isNaN(startDate) || isNaN(endDate)) {
      throw new Error("Invalid date passed to fetchLotAvailability");
    }

    const res = await axios.get(`${HOST}/api/lot-availability`, {
      params: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      withCredentials: true
    });

    console.log("Availability data:", res.data);
    return res.data;

  } catch (err) {
    console.error("Failed to fetch availability:", err);
    return [];
  }
}

