require('dotenv').config();
const {determineRegion} = require('./region-process');

const TAIKO_GROUPS_DATA_CSV_URL = process.env.TAIKO_GROUPS_DATA_CSV_URL;

if(!TAIKO_GROUPS_DATA_CSV_URL) {
  throw new Error('TAIKO_GROUPS_DATA_CSV_URL is not set in the environment variables');
}

const { fetchCsvAsUrl, schemaTypes } = require('./fetch-csv-json');

const mapPointsSchema = {
  name: schemaTypes.nonEmptyString,
  city: schemaTypes.optionalString,
  state: schemaTypes.optionalString,
  country: schemaTypes.optionalString,
  latitude: schemaTypes.parseFloatThrow,
  longitude: schemaTypes.parseFloatThrow,
  website: schemaTypes.optionalUrl,
}

module.exports = function remoteResolver() {
  const prefix = 'remotecsv2json:';

  return {
    name: 'remote-csv-json-resolver',

    async resolveId(source) {
      if (source === 'TAIKO_GROUPS_DATA_CSV_URL') {
        return source;
      }
      return null;
    },

    async load(id) {
      if (id === 'TAIKO_GROUPS_DATA_CSV_URL') {
        const data = await fetchCsvAsUrl(TAIKO_GROUPS_DATA_CSV_URL, mapPointsSchema);
        // Pre-calculate regions
        const dataWithRegions = data.map((marker) => ({
          ...marker,
          region: determineRegion([marker.longitude, marker.latitude])?.[0]
        }))
        const code = 'export default ' + JSON.stringify(dataWithRegions);
        return code;
      }
      return null;
    }
  };
}