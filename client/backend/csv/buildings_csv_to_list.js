const fs = require('fs');
const { parse } = require('csv-parse');


function parseBuildings(){
  return new Promise((resolve, reject) => {
    const buildings = []
    fs.createReadStream('csv/buildings.csv')
      .pipe(parse({ delimiter: ',', columns: true }))
      .on('data', (row) => {
        // Process each row of data
        // console.log(row);
        const cleaned_name = row['"Name of Building"'].replace('"', '');
        buildings.push({
          campus: row['Campus'],
          building_name: cleaned_name
        })
      })
      .on('end', () => {
        console.log('CSV file successfully processed\n');

        resolve(buildings);
      })
      .on('error', (error) => {
         reject(error.message);
      }); 
    })
}
(async () => {
  const buildings = await parseBuildings();
  console.log('first', buildings[0]);
})();