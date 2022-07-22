const sampleJson = require("./samples/3.json");
const { getValues, analyze } = require("./analyser");

console.log(JSON.stringify(analyze(sampleJson), undefined, 2));
// console.log(getValues(sampleJson, ["main", "menu", "value"]));
