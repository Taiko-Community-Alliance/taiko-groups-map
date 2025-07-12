const data = require('./region-layers.json');

console.log(Array.from(new Set(data.features.map(({properties}) => properties.fill))).join('\n'));

// name
// description
// styleUrl
// fill-opacity
// fill
  // #bcaaa4
  // #0288d1
  // #ce93d8
  // #f57c00 - california
  // #9fa8da
  // #0f9d58
  // #0097a7
  // #f9a825
  // #9ecae1
  // #ffea00 - canada
// stroke-opacity
// stroke
// stroke-width
// STATEFP
// STATENS
// AFFGEOID
// GEOID
// STUSPS
// NAME
    // Alabama
    // Alaska
    // Arizona
    // Arkansas
    // California
    // Colorado
    // Connecticut
    // Delaware
    // District of Columbia
    // Florida
    // Georgia
    // Hawaii
    // Idaho
    // Illinois
    // Indiana
    // Iowa
    // Kansas
    // Kentucky
    // Louisiana
    // Maine
    // Maryland
    // Massachusetts
    // Michigan
    // Minnesota
    // Mississippi
    // Missouri
    // Montana
    // Nebraska
    // Nevada
    // New Hampshire
    // New Jersey
    // New Mexico
    // New York
    // North Carolina
    // North Dakota
    // Ohio
    // Oklahoma
    // Oregon
    // Pennsylvania
    // Puerto Rico
    // Rhode Island
    // South Carolina
    // South Dakota
    // Tennessee
    // Texas
    // Utah
    // Vermont
    // Virginia
    // Washington
    // West Virginia
    // Wisconsin
    // Wyoming
// LSAD
// ALAND
// AWATER
// year
// prov_code
// prov_name_en
    // Alberta
    // Manitoba
    // Yukon
    // Saskatchewan
    // Nova Scotia
    // Northwest Territories
    // Prince Edward Island
    // Nunavut
    // Quebec
    // Ontario
    // British Columbia
    // Newfoundland and Labrador
    // New Brunswick
// prov_area_code
// prov_type
// prov_name_fr