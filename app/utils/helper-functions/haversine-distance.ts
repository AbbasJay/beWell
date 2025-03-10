import haversine from "haversine-distance";

const calculate_distance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    return haversine(
        { latitude: lat1, longitude: lng1 },
        { latitude: lat2, longitude: lng2 }
      );
}

export { calculate_distance };