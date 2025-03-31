const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sequelize = require('../db');
const ParkingLot = require('../models/ParkingLot');
const Rate = require('../models/Rate');

const csvPath = path.join(__dirname, "../csv/rates.csv"); // adjust if needed

const ratesToInsert = [];

function convertTime(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return null;

  const [time, meridian] = timeStr.trim().split(' ');
  let [hours, minutes, seconds] = time.split(':').map(Number);

  if (meridian === 'PM' && hours < 12) hours += 12;
  if (meridian === 'AM' && hours === 12) hours = 0;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds || 0).padStart(2, '0')}`;
}

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => ratesToInsert.push(row))
  .on('end', async () => {
    try {
      await sequelize.sync(); // Ensure models are initialized

      for (const row of ratesToInsert) {
        const lotName = row["Name"].trim();
        const permitType = row["Permit Type"]?.trim();

        const lot = await ParkingLot.findOne({ where: { name: lotName } });
        if (!lot) {
          console.warn(`[SKIP] No parking lot found for "${lotName}"`);
          continue;
        }

        await Rate.create({
          lot_id: lot.id,
          permit_type: permitType,
          hourly: parseFloat(row["Hourly"]) || null,
          daily: parseFloat(row["Daily"]) || null,
          max_hours: parseFloat(row["Max Hours"]) || null,
          monthly: parseFloat(row["Monthly"]) || null,
          semesterly_fall_spring: parseFloat(row["Semesterly (Fall/Spring)"]) || null,
          semesterly_summer: parseFloat(row["Semesterly (Summer)"]) || null,
          yearly: parseFloat(row["Yearly"]) || null,
          lot_start_time: convertTime(row["Lot Start Time"]),
          lot_end_time: convertTime(row["Lot End Time"]),
          event_parking_price: parseFloat(row["Event Parking Price"]) || null,
          sheet_number: parseInt(row["Sheet Number"]) || null,
          sheet_price: parseFloat(row["Sheet Price"]) || null,
        });

        console.log(`[✔] Inserted rate for ${lotName} (${permitType})`);
      }

      console.log('\nAll rate records imported successfully.');
      process.exit(0);
    } catch (err) {
      console.error('Error during import:', err.message);
      process.exit(1);
    }
  });
