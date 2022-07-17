const sampleJson = require("./sample.json");
const { getValues, analyze } = require("./analyser");

// console.log(JSON.stringify(analyze(sampleJson), undefined, 2));
console.log(getValues(sampleJson, ["menu", "value"]));
