export const validateAndFormatTimeSelection = ({ selectedDate, selectedHour, mode, initialTimes }) => {
    if (!selectedDate || selectedHour === "") {
      return { error: "Please select both date and hour for both arrival and departure." };
    }
  
    const formattedHour = selectedHour.padStart(2, '0');
    const timeStr = `${formattedHour}:00`;
    const newDate = new Date(`${selectedDate}T${timeStr}`);
    const now = new Date();
  
    // Prevent past date or hour selection
    const [year, month, day] = selectedDate.split("-").map(Number);
    const selectedDateObj = new Date(year, month - 1, day);
    const isToday = now.toDateString() === selectedDateObj.toDateString();
  
    if (selectedDateObj < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      return { error: "Cannot select a date in the past." };
    }
  
    if (isToday && parseInt(selectedHour) < now.getHours()) {
      return { error: "Cannot select an hour that has already fully passed today." };
    }
  
    // Format for display
    const formattedDate = newDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const formattedTime = newDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const formatted = `${formattedDate} | ${formattedTime}`;
  
    // Parse the opposite field
    const otherField = mode === "arrival" ? "departure" : "arrival";
    const [otherDateStr, otherTimeStr] = initialTimes[otherField]?.split(" | ") || [];
  
    let parsedOther = null;
    if (otherDateStr && otherTimeStr) {
      // Reconstruct full date string (assumes same year)
      const fullOtherString = `${otherDateStr}, ${new Date().getFullYear()} ${otherTimeStr}`;
      parsedOther = new Date(fullOtherString);
  
      if (isNaN(parsedOther.getTime())) {
        return { error: `Could not parse the existing ${otherField} time.` };
      }
    }
  
    // Time relationship validation
    if (parsedOther) {
      if (mode === "departure") {
        if (newDate <= parsedOther) {
          return { error: "Exit Before must be after Arrive After." };
        }
      }
  
      if (mode === "arrival") {
        if (newDate >= parsedOther) {
          // Auto-adjust departure to 1 hour after arrival
          const autoDep = new Date(newDate);
          autoDep.setHours(autoDep.getHours() + 1);
  
          const autoDepDate = autoDep.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          const autoDepTime = autoDep.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
  
          return {
            formatted,
            autoAdjust: {
              mode: "departure",
              value: `${autoDepDate} | ${autoDepTime}`,
            },
          };
        }
      }
    }
  
    return { formatted };
  };
  