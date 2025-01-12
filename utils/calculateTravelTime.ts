function calculateTravelTime(mechanic: any, user: any, speed = 20) {
  const R = 6371; // Earth's radius in km

  // Convert latitude and longitude from degrees to radians
  const lat1 = mechanic.lat * (Math.PI / 180);
  const lon1 = mechanic.longitude * (Math.PI / 180);
  const lat2 = user.lat * (Math.PI / 180);
  const lon2 = user.long * (Math.PI / 180);

  // Haversine formula
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  // Calculate travel time (time = distance / speed)
  const timeInHours = distance / speed;
  const timeInMinutes = timeInHours * 60;

  return Math.ceil(timeInMinutes); // Round up to nearest minute
}

// function calculateDistance(mechanic, user) {
//   const R = 6371; // Earth's radius in km
//   const lat1 = mechanic.lat * (Math.PI / 180);
//   const lon1 = mechanic.longitude * (Math.PI / 180);
//   const lat2 = user.lat * (Math.PI / 180);
//   const lon2 = user.long * (Math.PI / 180);

//   const dLat = lat2 - lat1;
//   const dLon = lon2 - lon1;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in km
// }

// const mechanic = { lat: 8.9991, longitude: 7.6171 };
// const user = { lat: 8.994618505595557, long: 7.616632918781448 };
// console.log(`Distance: ${calculateDistance(mechanic, user).toFixed(2)} km`);

// Example usage
// const mechanic = { lat: 8.9991, longitude: 7.6171 };
const user = { lat: 8.994618505595557, long: 7.616632918781448 };
const mechanic = { lat: 8.994618505595557, long: 7.616632918781448 };
const travelTime = calculateTravelTime(mechanic, user);

// console.log(`The mechanic is approximately ${travelTime} minutes away.`);

// google api: TODO: Create one
// async function getTravelTimeFromAPI(mechanic: any, user: any) {

//   const response = await fetch(
//     `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${mechanic.lat},${mechanic.longitude}&destinations=${user.lat},${user.long}&key=${apiKey}`
//   );
//   const data = await response.json();
//   console.log('Data', data);
//   const travelTime = data.rows[0].elements[0].duration.value / 60; // Time in minutes
//   return Math.ceil(travelTime);
// }
// console.log('getTravelTimeFromAPI', getTravelTimeFromAPI(mechanic, user));
