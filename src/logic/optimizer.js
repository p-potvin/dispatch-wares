/**
 * 2-opt route optimizer.
 * Minimises total Euclidean distance of a sequence of jobs
 * that have { lat, lng } (or { destLat, destLng }) coordinates.
 */
function distance(a, b) {
  const lat1 = a.lat ?? a.destLat ?? 0;
  const lng1 = a.lng ?? a.destLng ?? 0;
  const lat2 = b.lat ?? b.destLat ?? 0;
  const lng2 = b.lng ?? b.destLng ?? 0;
  return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
}


export function optimize(jobs) {
  if (!jobs || jobs.length < 3) return jobs;
  let route = [...jobs];
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < route.length - 1; i++) {
      for (let j = i + 2; j < route.length; j++) {
        const current =
          distance(route[i], route[i + 1]) + distance(route[j], route[(j + 1) % route.length]);
        const swapped =
          distance(route[i], route[j]) + distance(route[i + 1], route[(j + 1) % route.length]);
        if (swapped < current - 1e-10) {
          route = [
            ...route.slice(0, i + 1),
            ...route.slice(i + 1, j + 1).reverse(),
            ...route.slice(j + 1),
          ];
          improved = true;
        }
      }
    }
  }
  return route;
}
