export function calculateReservationCharge({
  startTime,
  endTime,
  rateStart,
  rateEnd,
  hourlyRate,
  maxHours,
  dailyMaxRate
}) {
  const msPerHour = 1000 * 60 * 60;
  const start = new Date(startTime);
  const end = new Date(endTime);

  const [startHr, startMin] = rateStart.split(':').map(Number);
  const [endHr, endMin] = rateEnd.split(':').map(Number);
  const rateStartFloat = startHr + startMin / 60;
  const rateEndFloat = endHr + endMin / 60;
  const isOvernight = rateEndFloat <= rateStartFloat;

  let totalCost = 0;
  let d = new Date(start);

  while (d < end) {
    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);

    const nextDay = new Date(dayStart);
    nextDay.setDate(dayStart.getDate() + 1);

    const windowStart = new Date(dayStart);
    windowStart.setHours(startHr, startMin, 0, 0);

    const windowEnd = new Date(dayStart);
    if (isOvernight) {
      windowEnd.setDate(windowEnd.getDate() + 1);
    }
    windowEnd.setHours(endHr, endMin, 0, 0);

    const billStart = new Date(Math.max(start, windowStart));
    const billEnd = new Date(Math.min(end, windowEnd));

    let hours = 0;
    for (
      let h = new Date(billStart);
      h < billEnd;
      h = new Date(h.getTime() + msPerHour)
    ) {
      hours++;
    }

    const cappedHours = Math.min(hours, maxHours);
    const raw = cappedHours * hourlyRate;
    totalCost += Math.min(raw, dailyMaxRate);

    // Advance to next day
    d = nextDay;
  }

  return {
    subtotal: parseFloat(totalCost.toFixed(2))
  };
}
