const fs = require('fs'); // File system module for reading files
const path = require('path'); // Path module for handling file paths
const csv = require('csv-parser'); // CSV parser module for reading CSV files
const { Rate, ParkingLot, sequelize } = require("../models");

const unmatchedLots = new Set(); // Use a Set to avoid duplicates


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

function parseMoney(value) {
    if (!value || value.trim() === '') return null;
    const sanitized = value.replace(/[$,]/g, ''); // Remove $ and commas
    const parsed = parseFloat(sanitized);
    return isNaN(parsed) ? null : parsed;
  }
  

// Read the CSV file and parse its content
fs.createReadStream(csvPath)
    .pipe(csv()) // Parse CSV rows
    .on('data', (row) => ratesToInsert.push(row)) // Add each row to the ratesToInsert array
    .on('end', async () => {
        try {
            // Authenticate the database connection
            await sequelize.authenticate();
            // Iterate over each row in the parsed CSV data
            for (const row of ratesToInsert) {
                const lotName = row["Name"]?.trim();
                const permitType = row["Permit Type"]?.trim();
            
                if (!lotName || !permitType) {
                    console.warn(`[SKIP] Missing lot name or permit type`);
                    continue;
                }
            
                const lot = await ParkingLot.findOne({ where: { name: lotName } });
            
                if (!lot) {
                    unmatchedLots.add(lotName); // Collect unmatched names
                    continue;
                }
            
                await Rate.create({
                    parking_lot_id: lot.id,
                    permit_type: permitType,
                    hourly: parseMoney(row["Hourly"]),
                    daily: parseMoney(row["Daily"]),
                    max_hours: parseFloat(row["Max Hours"]) || null,
                    monthly: parseMoney(row["Monthly"]),
                    semesterly_fall_spring: parseMoney(row["Semesterly (Fall/Spring)"]),
                    semesterly_summer: parseMoney(row["Semesterly (Summer)"]),
                    yearly: parseMoney(row["Yearly"]),
                    lot_start_time: convertTime(row["Lot Start Time"]),
                    lot_end_time: convertTime(row["Lot End Time"]),
                    event_parking_price: parseMoney(row["Event Parking Price"]),
                    sheet_number: parseInt(row["Sheet Number"]) || null,
                    sheet_price: parseMoney(row["Sheet Price"]),
                });
            
                console.log(`[✔] Inserted rate for ${lotName} (${permitType})`);
            }
            

            console.log('\nAll rate records imported successfully.'); // Log completion message

            process.exit(0); // Exit the process successfully
        } catch (err) {
            console.error('Error during import:', err.message); // Log error message
            process.exit(1); // Exit the process with an error
        }
    });
