const EARTH_RADIUS_KM = 6371;
const AVG_SPEED_KMH = 60;
const MAX_DRIVING_HOURS = 8;
const MANDATORY_BREAK_MINUTES = 30;
const BREAK_AFTER_HOURS = 4.5;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineKm(a, b) {
  const lat1 = a.lat ?? a.destLat ?? 0;
  const lng1 = a.lng ?? a.destLng ?? 0;
  const lat2 = b.lat ?? b.destLat ?? 0;
  const lng2 = b.lng ?? b.destLng ?? 0;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const a2 =
    sinLat * sinLat + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * sinLng * sinLng;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a2));
}

/**
 * Checks whether the given list of jobs can be completed within the 8-hour
 * driving law, inserting a mandatory 30-min break after 4.5 h of driving.
 * Returns { compliant, totalHours, breakInserted }.
 */
export function checkHoursCompliance(jobs) {
  if (!jobs || jobs.length === 0) {
    return { compliant: true, totalHours: 0, breakInserted: false };
  }

  let drivingHours = 0;
  let breakInserted = false;

  for (let i = 0; i < jobs.length - 1; i++) {
    const km = haversineKm(jobs[i], jobs[i + 1]);
    const segmentHours = km / AVG_SPEED_KMH;

    if (!breakInserted && drivingHours + segmentHours > BREAK_AFTER_HOURS) {
      drivingHours += MANDATORY_BREAK_MINUTES / 60;
      breakInserted = true;
    }

    drivingHours += segmentHours;
  }

  return {
    compliant: drivingHours <= MAX_DRIVING_HOURS,
    totalHours: Math.round(drivingHours * 100) / 100,
    breakInserted,
  };
}
