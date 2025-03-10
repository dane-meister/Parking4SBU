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
function writeCleanBuildingsToCSV(buildings){
  const header = Object.keys(buildings[0]);
  let csvRows = [];
  csvRows.push(header.join(','));

  for(const row of buildings){
    const values = header.map(key => {
      let value = row[key];
      value = value.replace('“', "");
      value = value.replace('”', "");
      value = value.replace('"', "");

      return value;
    });
    csvRows.push(values.join(','));
  }
  
  csvRows = csvRows.join('\n');
  fs.writeFile('csv/buildings_data.csv', csvRows, (err) => {
    if(err){
      console.error('Error csv');
    }else{
      console.log("Cleaned csv saved.\n");
    }
  });
}
(async () => {
  let buildings = await parseBuildings();
  
  //filter out buildings off campus
  const on_campus = ['SBU SOUTH', 'SBU EAST', 'SBU WEST', 'SBU R&D'];
  let off_campus = [];
  buildings = buildings.filter(building_data => {
    if( on_campus.includes(building_data['campus']) ){
      return true;
    } else {
      if( !off_campus.includes(building_data['campus']) ){
        off_campus.push(building_data['campus']);
      }
      return false;
    }
  });
  console.log(`off_campus=${off_campus}`);

  writeCleanBuildingsToCSV(buildings);
})();
