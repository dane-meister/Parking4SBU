import axios from 'axios';

// const HOST = "http://localhost:8000";
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable for API URL

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
    return res.data;

  } catch (err) {
    console.error("Failed to fetch availability:", err);
    return [];
  }
}

