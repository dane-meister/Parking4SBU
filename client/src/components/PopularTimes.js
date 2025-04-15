import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';  // ensures that all chart components are registered
import '../stylesheets/PopularTimes.css';

export default function PopularTimes({ lotId, initialSelectedDay }) {
    const [popularData, setPopularData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedDay, setSelectedDay] = useState(
        initialSelectedDay || new Date().toLocaleDateString('en-US', { weekday: 'long' })
    );


    const forecastHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3];


    useEffect(() => {
        async function fetchPopularTimes() {
            try {
                const response = await fetch(`http://localhost:8000/api/popular-times/${lotId}`);
                if (!response.ok) throw new Error("Failed to fetch popular times data.");
                const data = await response.json();
                setPopularData(data);
                console.log("popular times: ", data);
                console.log("lot id: ", lotId);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPopularTimes();
    }, [lotId]);

    if (loading) return <div>Loading popular times data...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!popularData) return null;

    const dayData = popularData[selectedDay] || {};
    const occupancyCounts = forecastHours.map(hr => dayData[hr] || 0);
    const maxOccupancy = Math.max(...occupancyCounts);
    const yAxisMax = maxOccupancy < 100 ? Math.ceil((maxOccupancy + 10) / 10) * 10 : 100;

    const chartOptions = {
        scales: {
            x: {
                ticks: {
                    callback: function (value, index) {
                        const hour = forecastHours[index];
                        //only label hours divisible by 3
                        return (hour % 3 === 0) ? `${hour}:00` : '';
                    }
                },
                grid: { display: false },
                title: { display: true, text: 'Hour of Day' }
            },
            y: {
                beginAtZero: true,
                max: yAxisMax,
                ticks: {
                    display: false  // hides the numbers on the y-axis
                },
                grid: { display: false },
                title: { display: true, text: 'Occupancy (%)' }
            }
        },
        plugins: {
            legend: { display: false },
            // tooltip: {
            //     callbacks: {
            //         label: function (context) {
            //             const occupancy = context.raw;
            //             let description = "";
            //             if (occupancy < 20) {
            //                 description = "Usually not too busy";
            //             } else if (occupancy < 40) {
            //                 description = "Somewhat busy";
            //             } else if (occupancy < 60) {
            //                 description = "Moderately busy";
            //             } else if (occupancy < 80) {
            //                 description = "Busy";
            //             } else {
            //                 description = "As busy as it gets";
            //             }
            //             return description;
            //         }
            //     }
            // }
        }
    };


    const data = {
        labels: forecastHours.map(hr => `${hr}:00`),
        datasets: [{
            label: `${selectedDay} Occupancy (%)`,
            data: occupancyCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    return (
        <div className="popular-times">
            <div className="popular-times-tabs">
                {Object.keys(popularData).map(day => (
                    <button
                        key={day}
                        className={`tab-button ${day === selectedDay ? 'active' : ''}`}
                        onClick={() => setSelectedDay(day)}
                    >
                        {day}
                    </button>
                ))}
            </div>
            <div className="popular-times-graph">
                <Bar data={data} options={chartOptions} />
            </div>
        </div>
    );
}
