const regionsFeatures = require('./region-layers.json');
const markers = require('./temp-makers');

function getBoundingBox(polygon) {
    let minLong = polygon[0][0];
    let minLat = polygon[0][1];
    let maxLong = polygon[0][0];
    let maxLat = polygon[0][1];
    for (let i = 1; i < polygon.length; i++) {
        const [long,lat] = polygon[i];
        if(long < minLong) minLong = long;
        if(long > maxLong) maxLong = long;
        if(lat < minLat) minLat = lat;
        if(lat > maxLat) maxLat = lat;
    }
    return [[minLong,minLat],[maxLong,maxLat]];
}

function isPointInBoundingBox(point,boundingBox) {
    if(point[0] < boundingBox[0][0]) return false;
    if(point[0] > boundingBox[1][0]) return false;
    if(point[1] < boundingBox[0][1]) return false;
    if(point[1] > boundingBox[1][1]) return false;
    return true;
}

function linesIntersect([p1, q1], [p2, q2])
{
    // Equation of line 1:
    // a1*x + b1*y = c1
    let a1 = q1[1] - p1[1];
    let b1 = p1[0] - q1[0];
    let c1 = a1 * p1[0] + b1 * p1[1];

    // Equation of line 2:
    // a2*x + b2*y = c2
    let a2 = q2[1] - p2[1];
    let b2 = p2[0] - q2[0];
    let c2 = a2 * p2[0] + b2 * p2[1];

    // Determinant of the two line equations.
    // If it is 0, the lines are parallel or collinear.
    let det = a1 * b2 - a2 * b1;

    // We don't care about collinear intersection
    if (det === 0) {
        return false;
    }

    // Calculate the numerator of the intersection point.
    // x = xNum / det
    // y = yNum / det
    let xNum = b2 * c1 - b1 * c2;
    let yNum = a1 * c2 - a2 * c1;

    // Find the bounding box of the first segment.
    let minX1 = Math.min(p1[0], q1[0]);
    let maxX1 = Math.max(p1[0], q1[0]);
    let minY1 = Math.min(p1[1], q1[1]);
    let maxY1 = Math.max(p1[1], q1[1]);

    // Find the bounding box of the second segment.
    let minX2 = Math.min(p2[0], q2[0]);
    let maxX2 = Math.max(p2[0], q2[0]);
    let minY2 = Math.min(p2[1], q2[1]);
    let maxY2 = Math.max(p2[1], q2[1]);

    // Make the denominator positive so that
    // all comparisons below use the same direction.
    if (det < 0) {
        det = -det;
        xNum = -xNum;
        yNum = -yNum;
    }

    // Check whether the intersection point lies
    // inside both line segments.
    return (xNum >= minX1 * det && xNum <= maxX1 * det
            && yNum >= minY1 * det && yNum <= maxY1 * det
            && xNum >= minX2 * det && xNum <= maxX2 * det
            && yNum >= minY2 * det && yNum <= maxY2 * det);
}

function isPointInPolygon(point, polygon) {

    const box = getBoundingBox(polygon);
    const ray = [[box[0][0],box[0][1]],[point[0],point[1]]];
    let odd = false;
    for (let i = 0; i < polygon.length - 1; i++) {
        if(linesIntersect(
            [polygon[i],polygon[i+1]],
            ray
        )) {
            // console.log(`
            //     <line x1="${(polygon[i][0] - box[0][0])*10}" y1="${(polygon[i][1] - box[0][1])*10}" x2="${(polygon[i+1][0] - box[0][0])*10}" y2="${(polygon[i+1][1] - box[0][1])*10}" style="stroke:red;" /> 
            // `);
            odd = !odd;
        } else {
            // console.log(`
            //     <line x1="${(polygon[i][0] - box[0][0])*10}" y1="${(polygon[i][1] - box[0][1])*10}" x2="${(polygon[i+1][0] - box[0][0])*10}" y2="${(polygon[i+1][1] - box[0][1])*10}" style="stroke:blue;" /> 
            // `);            
        }
    }
    // console.log(`
    //     <line x1="${(ray[0][0] - box[0][0])*10}" y1="${(ray[0][1] - box[0][1])*10}" x2="${(ray[1][0] - box[0][0])*10}" y2="${(ray[1][1] - box[0][1])*10}" style="stroke:green;" /> 
    // `);     
    return odd;
}

function getRegions(point, regions) {
    const featuresIn = regions.filter(({boundingBoxes, polygons, properties}) => {
        for (let i = 0; i < polygons.length; i++) {
            if(isPointInBoundingBox(point, boundingBoxes[i])) {
                if(isPointInPolygon(point, polygons[i])) {
                    return true;
                }
            }
        }
        return false;
    });

    return featuresIn;
}

// Normalize polygon data and pre-determine bounding boxes
for (let i = 0; i < regionsFeatures.features.length; i++) {
    if(regionsFeatures.features[i].geometry.type === 'MultiPolygon') {
        regionsFeatures.features[i].polygons = regionsFeatures.features[i].geometry.coordinates.map(([i]) => i);
    } else {
        regionsFeatures.features[i].polygons = regionsFeatures.features[i].geometry.coordinates;
    }
    regionsFeatures.features[i].boundingBoxes = regionsFeatures.features[i].polygons.map(getBoundingBox);
}

// Determines which region(s) a given location belongs to
// Returns the names
module.exports.determineRegion = function([longitude, latitude]) {
    return getRegions([longitude, latitude], regionsFeatures.features).map(({properties}) => properties.name);
}