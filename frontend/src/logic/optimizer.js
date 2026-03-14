export const optimizeRouteLocal = (deliveries) => {
  if (deliveries.length < 3) return deliveries;
  let tour = [...deliveries];
  
  const dist = (a, b) => Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));

  // Simple 2-Opt Loop
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < tour.length - 1; i++) {
      for (let j = i + 1; j < tour.length; j++) {
        if (dist(tour[i-1], tour[i]) + dist(tour[j-1], tour[j]) >
            dist(tour[i-1], tour[j-1]) + dist(tour[i], tour[j])) {
          tour.splice(i, j - i, ...tour.slice(i, j).reverse());
          improved = true;
        }
      }
    }
  }
  return tour;
};