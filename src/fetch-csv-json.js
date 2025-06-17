const axios = require('axios');
const csv = require('csvtojson')

const parseFloatThrow = (str) => {
  const fl = parseFloat(str);
  if(isNaN(fl)) {
    throw new Error(`Invalid float`);
  }
  return fl;
};

const nonEmptyString = (str) => {
  if (str.trim() === '') {
    throw new Error(`String cannot be empty`);
  }
  return str.trim();
};

const optionalString = (str) => {
  return str.trim();
};

const optionalUrl = (str) => {
  if (str.trim() === '') {
    return;
  }
  try {
    const url = new URL(str.trim());
    return url.toString();
  } catch (error) {
    throw new Error(`Invalid URL: ${str}`);
  }
};

module.exports.schemaTypes = {
  nonEmptyString,
  optionalString,
  optionalUrl,
  parseFloatThrow,
}

/**
 * Fetch a CSV file from a URL and convert it to JSON based on the provided schema.
 * @param {string} csvUrl - The URL of the CSV file.
 * @param {Object} schema - An object defining the schema for the CSV data, where keys are column names and values are functions to process the data.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects representing the CSV data.
 * @throws {Error} - Throws an error if the CSV headers do not match the schema or if there is an error processing a row.
 */
const fetchCsvAsUrl = module.exports.fetchCsvAsUrl = async (csvUrl, schema) => {

  const allowedHeaders = Object.keys(schema);
  const res = await axios.get(csvUrl, {responseType: 'stream'});
  const data = await csv({output: 'csv', noheader: true}).fromStream(res.data);
  const headers = data[0].map(header => header.toLowerCase());
  const rows = data.slice(1);

  // throw if headers does not include all allowedHeaders
  const missingHeaders = allowedHeaders.filter(header => !headers.includes(header));
  if (missingHeaders.length) {
    throw new Error(`CSV headers must include: "${allowedHeaders.join(', ')}". Missing headers: "${missingHeaders.join(', ')}"`);
  }
  // Map rows to objects
  const jsonData = rows.map((row, rowIndex) => {
    const obj = {};
    headers.forEach((header, colIndex) => {
      if (allowedHeaders.includes(header)) {
        try {
          obj[header] = schema[header](row[colIndex]);
        } catch (error) {
          throw new Error(`Error processing row ${rowIndex + 2} for column "${header}" with value "${row[colIndex]}": ${error.message}. Whole row: ${JSON.stringify(row)}`);
        }
      }
    });
    return obj;
  });

  return jsonData

};
