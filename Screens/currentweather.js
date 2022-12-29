import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { WEATHER_API_URL, WEATHER_API_KEY } from "../utils/api.js";
import Header from "../Components/Header.js";

const Currentweather = () => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    setRefreshing(true);

    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
    }
    const Location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    const response = await fetch(
      `${WEATHER_API_URL}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();

    if (!response.ok) {
      Alert.alert(`Error retrieving weather data: ${data.message}`);
    } else {
      setForecast(data);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadForecast();
  }, []);

  if (!forecast) {
    return (
      <SafeAreaView style={StyleSheet.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const current = forecast.currenr.weather[0];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              loadForecast();
            }}
            refreshing={refreshing}
          />
        }
      >
        <Text style={styles.title}>Current Weather</Text>
        <Text style={{ alignItems: "center", textAlign: "center" }}>
          Your Location
        </Text>
        <View style={styles.current}>
          <Image
            style={styles.largeIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`,
            }}
          />
          <Text style={styles.currentTemp}>
            {Math.round(forecast.current.temp)}°C
          </Text>
        </View>
        <Text style={styles.currentDescription}>{current.description}</Text>
        <View style={styles.extraInfo}>
          <View style={styles.info}>
            <Image
              source={require("../assets/temp.png")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40 / 2,
                marginLeft: 50,
              }}
            />
            <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>
              {forecast.current.feels_like}°C
            </Text>
            <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>
              Feels Like
            </Text>
          </View>
          <View style={styles.info}>
            <Image
              source={require("../assets/humidity.png")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40 / 2,
                marginLeft: 50,
              }}
            />
            <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>
              {forecast.current.humidity}%{" "}
            </Text>
            <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>
              Humidity
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.subtitle}>Hourly Forecast</Text>
          <FlatList
            horizontal
            data={forecast.hourly.slice(0, 24)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(hour) => {
              const weather = hour.item.weather[0];
              var dt = new Date(hour.item.dt * 1000);
              return (
                <View style={styles.hour}>
                  <Text>{dt.toLocaleTimeString().replace(/:\d+ /, " ")}</Text>
                  <Text>{Math.round(hour.item.temp)}°C</Text>
                  <Image
                    style={styles.smallIcon}
                    source={{
                      uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                    }}
                  />
                  <Text>{weather.description}</Text>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Currentweather;

const styles = StyleSheet.create({
  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: "#e96e50",
  },
  subtitle: {
    fontSize: 24,
    marginVertical: 12,
    marginLeft: 7,
    color: "#e96e50",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFBF6",
  },
  loading: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  current: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  currentDescription: {
    width: "100%",
    textAlign: "center",
    fontWeight: "200",
    fontSize: 24,
    marginBottom: 5,
  },
  hour: {
    padding: 6,
    alignItems: "center",
  },
  largeIcon: {
    width: 300,
    height: 250,
  },
  smallIcon: {
    width: 100,
    height: 100,
  },
  extraInfo: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    padding: 10,
  },
  info: {
    width: Dimensions.get("screen").width / 2.5,
    backgroundColor: "rgba(0,0,0, 0.5)",
    padding: 10,
    borderRadius: 15,
    justifyContent: "center",
  },
});
