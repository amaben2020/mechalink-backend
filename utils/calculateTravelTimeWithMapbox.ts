type TLocationData = {
  latitude: number;
  longitude: number;
};

export async function getTravelTimeFromMapboxAPI({
  mechanic,
  user,
}: {
  mechanic: TLocationData;
  user: TLocationData;
}) {
  if (mechanic.latitude === user.latitude) {
    return 0;
  }

  const apiKey = process.env.PUBLIC_MAP_BOX_API_KEY;

  // Construct the Mapbox Directions API URL
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${mechanic.longitude},${mechanic.latitude};${user.longitude},${user.latitude}?access_token=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    // Extract duration (in seconds) from the response
    const durationInSeconds = Number(data.routes[0].duration);

    // Convert duration to minutes and round up
    const travelTimeInMinutes = Math.ceil(Number(durationInSeconds) / 60);

    return travelTimeInMinutes;
  } catch (error) {
    console.error('Failed to fetch travel time:', error);
    throw error; // Rethrow the error for handling by the caller
  }
}

// console.log(
//   'getTravelTimeFromMapboxAPI',
//   getTravelTimeFromMapboxAPI(mechanic, user)
// );
