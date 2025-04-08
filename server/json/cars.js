const { log } = require('console');
const fs = require('fs');

const rawData = fs.readFileSync('Car_Model_List.json', 'utf-8');
const jsonData = JSON.parse(rawData);
const data = jsonData.results;

let makes = [];
let years = [];
for(let car of data){
    if(!makes.includes(car.Make)){
        makes.push(car.Make);
    }
    if(!years.includes(car.Year)){
        years.push(car.Year)
    }
}
console.log(makes);
console.log("Newest model:",years.sort()[years.length - 1]);
 