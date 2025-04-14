export function getDateWithTime(displayStr) {
  if (!displayStr) return null;

  try {
    // Expected format: "Mon, Apr 15 | 5:00 PM"
    const [datePart, timePart] = displayStr.split(" | ");
    if (!datePart || !timePart) return null;

    // Append the current year (assuming it's not shown)
    const fullString = `${datePart}, ${new Date().getFullYear()} ${timePart}`;

    const parsedDate = new Date(fullString);
    if (isNaN(parsedDate.getTime())) {
      console.warn("Failed to parse date string:", fullString);
      return null;
    }

    return parsedDate.toISOString(); // Convert to ISO for server
  } catch (err) {
    console.error("Error in getDateWithTime:", err);
    return null;
  }
}
