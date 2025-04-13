export function getDateWithTime(timeStr) {
    const today = new Date();
    const [hourMin, meridian] = timeStr.split(' ');
    let [hours, minutes] = hourMin.split(':').map(Number);
  
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
  
    const result = new Date(today);
    result.setHours(hours, minutes, 0, 0); // set to selected time
    return result;
  }