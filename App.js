import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { getDistance, getPreciseDistance } from "geolib";

// You can import from local files

let apiKey = "YOUR_API_KEY";

import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [latitude, setlatitude] = useState("");
  const [longitude, setlongitude] = useState("");
  const [l, setl] = useState("");
  // const [getLocation, setGetLocation] = useState(false);
  var dis = getDistance(
    { latitude: 24.8321334, longitude: 67.2220342 },
    { latitude: 24.8322453, longitude: 67.2205446 },
    { accuracy: 1000 }
  );
  console.log(":::::::::", dis);
  const getLocation = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      Location.setGoogleApiKey(apiKey);

      console.log(status);

      let { coords } = await Location.getCurrentPositionAsync();

      setLocation(coords);
      setlatitude(coords.latitude);
      setlongitude(coords.longitude);
      console.log("longitue", "latitude__>>>>>>>>>", longitude, latitude);

      console.log(coords);

      if (coords) {
        let { longitude, latitude } = coords;

        let regionName = await Location.reverseGeocodeAsync({
          longitude,
          latitude,
        });
        setAddress(regionName[0]);
        console.log(regionName, "nothing");
      }

      // console.log();
    })();
  };
  // lat1 = 24.8321334;
  // lon1 = 67.2220342;
  // lat2 = 24.8322453;
  // lon2 = 67.2205446;
  function measure() {
    // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = (24.8322453 * Math.PI) / 180 - (24.8321334 * Math.PI) / 180;
    var dLon = (67.2205446 * Math.PI) / 180 - (67.2220342 * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((24.8321334 * Math.PI) / 180) *
        Math.cos((24.8322453 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return setl(d * 1000); // meters
  }
  useEffect(() => {
    measure();
    console.log("--------------------------", l);
  });
  return (
    <View style={styles.container}>
      <Text style={styles.big}>
        {!location
          ? "Waiting"
          : `Lat: ${location.latitude} \nLong: ${
              location.longitude
            } \n${JSON.stringify(address?.["subregion"])}`}
      </Text>
      <TouchableOpacity onPress={getLocation}>
        <View
          style={{
            height: 100,
            backgroundColor: "teal",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <Text style={styles.btnText}> GET LOCATION </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  big: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 25,
    color: "white",
  },
});
