const fs = require('fs');
const csv = require('csv-parser');
const path = require("path");
const { User, Vehicle, sequelize } = require("../models");

const salt_rounds = 12;
const bcrypt = require("bcrypt");

// Function to read a CSV file and populate the database with user data
const populateUsers = async () => {
  try {
    // Authenticate the database connection
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync();

    // Step 1: Read all rows from CSV first (without hashing passwords)
    const rawData = await new Promise((resolve, reject) => {
      const rows = [];
      
      fs.createReadStream(path.join(__dirname, "../csv/users.csv"))
        .pipe(csv())
        .on('data', (row) => rows.push(row)) // Just collect raw rows here
        .on('end', () => {
          console.log(`Read ${rows.length} rows from CSV`);
          resolve(rows);
        })
        .on('error', (error) => reject(error));
    });

    // Step 2: Process data and hash passwords
    const usersData = [];
    for (const row of rawData) {
      const { 
        email,
        password,
        first_name,
        last_name,
        phone_number,
        user_type,
        permit_type,
        driver_license_number,
        dl_state,
        address_line,
        city,
        state_region,
        postal_zip_code,
        country,
        is_approved,
      } = row;

      // Now we can properly await the hash
      const hashed_password = await bcrypt.hash(password, salt_rounds);
      // convert strings to bool
      const is_approved_value = is_approved === 'true' ? true : false;

      usersData.push({
        email,
        password: hashed_password,
        first_name,
        last_name,
        phone_number,
        user_type,
        permit_type,
        driver_license_number,
        dl_state,
        address_line,
        city,
        state_region,
        postal_zip_code,
        country,
        isApproved: is_approved_value,
      });
    }

    console.log(`Processed ${usersData.length} users with hashed passwords`);
    
    // Step 3: Now that we have all data processed, insert it into the database
    if (usersData.length > 0) {
      await User.bulkCreate(usersData);
      console.log(`Data inserted successfully! Created ${usersData.length} users.`);
    } else {
      console.log("No data to insert.");
    }
    
    return usersData.length; // Return the number of records inserted
    
  } catch (error) {
    console.error('Error in populateUsers:', error);
    throw error; // Re-throw to allow caller to handle
  }
};

// Run the function to populate the database
populateUsers()
  .then(count => {
    console.log(`Successfully added ${count} users to the database`);
  })
  .catch(err => console.error('Failed to populate users:', err));