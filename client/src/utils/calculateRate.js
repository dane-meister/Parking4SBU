export function calculateReservationCharge({
    startTime,
    endTime,
    rateStart,    
    rateEnd,      
    hourlyRate,    
    maxHours,     
    dailyMaxRate  
  }) {
    console.log("Calculating reservation charge...");
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);
    console.log("Rate Start:", rateStart);
    console.log("Rate End:", rateEnd);
    console.log("Hourly Rate:", hourlyRate);
    console.log("Max Hours:", maxHours);
    console.log("Daily Max Rate:", dailyMaxRate);
    const msPerHour = 1000 * 60 * 60;
    const start = new Date(startTime);
    const end = new Date(endTime);
  
    let totalBillableHours = 0;
  
    // Convert rate window to hour float
    const [rateStartHour, rateStartMin] = rateStart.split(':').map(Number);
    const [rateEndHour, rateEndMin] = rateEnd.split(':').map(Number);
    const rateStartFloat = rateStartHour + rateStartMin / 60;
    const rateEndFloat = rateEndHour + rateEndMin / 60;
    const isOvernight = rateEndFloat <= rateStartFloat;
  
    for (let d = new Date(start); d < end; d = new Date(d.getTime() + msPerHour)) {
      const hourFloat = d.getHours() + d.getMinutes() / 60;
      if (isOvernight) {
        if (hourFloat >= rateStartFloat || hourFloat < rateEndFloat) {
          totalBillableHours++;
        }
      } else {
        if (hourFloat >= rateStartFloat && hourFloat < rateEndFloat) {
          totalBillableHours++;
        }
      }
    }
  
    const cappedHours = Math.min(totalBillableHours, maxHours);
    const rawCost = cappedHours * hourlyRate;
    const totalCost = Math.min(rawCost, dailyMaxRate);
  
    return {
      hoursBilled: cappedHours,
      subtotal: parseFloat(totalCost.toFixed(2))
    };
  }
  