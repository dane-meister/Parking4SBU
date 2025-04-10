export function formatTime(timeStr) {
    if (!timeStr) return '';
  
    const [hourStr, minuteStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
  
    hour = hour % 12;
    if (hour === 0) hour = 12;
  
    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  }
  
  export function formatTimeRange(start, end) {
    if (!start || !end) return '';
    return `${formatTime(start)} - ${formatTime(end)}`;
  }
  
  