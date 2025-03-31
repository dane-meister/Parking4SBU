const fs = require('fs'); // File system module for reading files
const path = require('path'); // Path module for handling file paths
const csv = require('csv-parser'); // CSV parser module for reading CSV files
const sequelize = require('../db'); // Sequelize instance for database connection
const ParkingLot = require('../models/ParkingLot'); // ParkingLot model
const Rate = require('../models/Rate'); // Rate model

// Path to the CSV file containing rate data
const csvPath = path.join(__dirname, "../csv/rates.csv"); // Adjust the path if needed

const ratesToInsert = []; // Array to store parsed CSV rows

// Function to convert time strings (e.g., "12:30 PM") to 24-hour format (e.g., "12:30:00")
function convertTime(timeStr) {
    if (!timeStr || !timeStr.includes(':')) return null; // Return null if time string is invalid

    const [time, meridian] = timeStr.trim().split(' '); // Split time and AM/PM
    let [hours, minutes, seconds] = time.split(':').map(Number); // Parse hours, minutes, and seconds

    // Convert to 24-hour format
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    // Return formatted time string
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds || 0).padStart(2, '0')}`;
}

// Read the CSV file and parse its content
fs.createReadStream(csvPath)
    .pipe(csv()) // Parse CSV rows
    .on('data', (row) => ratesToInsert.push(row)) // Add each row to the ratesToInsert array
    .on('end', async () => {
        try {
            await sequelize.sync(); // Ensure models are initialized and database is synced

            // Iterate over each row in the parsed CSV data
            for (const row of ratesToInsert) {
                const lotName = row["Name"].trim(); // Get and trim the parking lot name
                const permitType = row["Permit Type"]?.trim(); // Get and trim the permit type

                // Find the parking lot by name
                const lot = await ParkingLot.findOne({ where: { name: lotName } });
                if (!lot) {
                    console.warn(`[SKIP] No parking lot found for "${lotName}"`); // Skip if parking lot is not found
                    continue;
                }

                // Create a new rate record in the database
                await Rate.create({
                    lot_id: lot.id, // Associate rate with the parking lot
                    permit_type: permitType, // Permit type
                    hourly: parseFloat(row["Hourly"]) || null, // Hourly rate
                    daily: parseFloat(row["Daily"]) || null, // Daily rate
                    max_hours: parseFloat(row["Max Hours"]) || null, // Maximum hours
                    monthly: parseFloat(row["Monthly"]) || null, // Monthly rate
                    semesterly_fall_spring: parseFloat(row["Semesterly (Fall/Spring)"]) || null, // Semesterly rate (Fall/Spring)
                    semesterly_summer: parseFloat(row["Semesterly (Summer)"]) || null, // Semesterly rate (Summer)
                    yearly: parseFloat(row["Yearly"]) || null, // Yearly rate
                    lot_start_time: convertTime(row["Lot Start Time"]), // Lot start time
                    lot_end_time: convertTime(row["Lot End Time"]), // Lot end time
                    event_parking_price: parseFloat(row["Event Parking Price"]) || null, // Event parking price
                    sheet_number: parseInt(row["Sheet Number"]) || null, // Sheet number
                    sheet_price: parseFloat(row["Sheet Price"]) || null, // Sheet price
                });

                console.log(`[✔] Inserted rate for ${lotName} (${permitType})`); // Log success message
            }

            console.log('\nAll rate records imported successfully.'); // Log completion message
            process.exit(0); // Exit the process successfully
        } catch (err) {
            console.error('Error during import:', err.message); // Log error message
            process.exit(1); // Exit the process with an error
        }
    });
