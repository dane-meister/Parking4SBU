const express = require('express');
const router = express.Router();
const { Reservation, ParkingLot } = require('../models');
const { Op } = require('sequelize');

//returns the list of hours in our forecast range (6 AM to 3 AM next day)
const getForecastHours = () => {
    const hours = [];
    for (let h = 6; h < 24; h++) {
        hours.push(h);
    }
    for (let h = 0; h <= 3; h++) {
        hours.push(h);
    }
    return hours;
};

router.get('/:lotId', async (req, res) => {
    const { lotId } = req.params;
    const forecastHours = getForecastHours();

    try {
        //period is the past 1 month.
        const periodStart = new Date();
        periodStart.setMonth(periodStart.getMonth() - 1);

        //retrieve all reservations for this lot in the past month.
        const reservations = await Reservation.findAll({
            where: { parking_lot_id: lotId },
            start_time: { [Op.gte]: periodStart }
        });

        const parkingLot = await ParkingLot.findOne({ where: { id: lotId } });
        if (!parkingLot) {
            return res.status(404).json({ error: 'Parking lot not found.' });
        }
        const capacity = parkingLot.capacity || 1; // guard against division by zero

        //object to store data per day of the week.
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const popularTimes = {};
        days.forEach(day => {
            popularTimes[day] = {};
            forecastHours.forEach(hr => {
                popularTimes[day][hr] = 0; // initialise count
            });
        });


        //count the number of occurrences of each weekday within the period.
        const countDays = {};
        days.forEach(day => countDays[day] = 0);
        const currentDate = new Date(periodStart);
        const today = new Date();
        while (currentDate <= today) {
            const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
            countDays[dayOfWeek] += 1;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        //iterate over reservations and aggregate counts
        reservations.forEach(reservation => {
            const start = new Date(reservation.start_time);
            const end = new Date(reservation.end_time);

            //for each reservation, iterate the hours it spans.
            const iterDate = new Date(start);
            while (iterDate < end) {
                const currentHour = iterDate.getHours();
                //only count if within our forecast hours.
                if (forecastHours.includes(currentHour)) {
                    //determine the day of week. Using toLocaleDateString with weekday:
                    const dayOfWeek = iterDate.toLocaleDateString('en-US', { weekday: 'long' });
                    popularTimes[dayOfWeek][currentHour] += 1;
                }
                iterDate.setHours(iterDate.getHours() + 1);
            }
        });


        days.forEach(day => {
            forecastHours.forEach(hr => {
              const avgOccupancy = (popularTimes[day][hr] / (countDays[day] * capacity)) * 100;
              popularTimes[day][hr] = Math.round(avgOccupancy);
            //   if (popularTimes[day][hr]){ 
            //     console.log("popular times for day: ", day, "and time: ", hr," - ", popularTimes[day][hr], "and capacity:", capacity);
            //   }
            });
          });

        // Object.keys(popularTimes).forEach(day => {
        //     forecastHours.forEach(hr => {
        //         if (popularTimes[day][hr]){ 
        //             console.log("popular times for day: ", day, "and time: ", hr," - ", popularTimes[day][hr], "and capacity:", capacity);
        //         }
        //         popularTimes[day][hr] = Math.round((popularTimes[day][hr] / capacity) * 100);
        //         if (popularTimes[day][hr]){ 
        //             console.log("popular times for day: ", day, "and time: ", hr," - ", popularTimes[day][hr]);
        //         }
        //     });
        //   });

        res.json(popularTimes);
    } catch (error) {
        console.error("Error generating popular times:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;