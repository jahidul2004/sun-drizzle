import Constants from "expo-constants";
import { useEffect, useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface WeatherData {
    temp: number;
    condition: string;
    high: number;
    low: number;
    feelsLike: number;
    humidity: number;
    wind: number;
    icon: string;
    forecast: ForecastItem[];
    days: DayForecast[];
}

interface ForecastItem {
    time: string;
    temp: number;
    icon: string;
}

interface DayForecast {
    day: string;
    high: number;
    low: number;
    icon: string;
}

interface ApiResponse {
    cod: string;
    message?: string;
    list?: {
        dt: number;
        dt_txt: string;
        main: {
            temp: number;
            temp_max: number;
            temp_min: number;
            feels_like: number;
            humidity: number;
        };
        weather: {
            main: string;
            icon: string;
        }[];
        wind: {
            speed: number;
        };
    }[];
    city?: {
        country: string;
    };
}

const API_KEY: string = Constants.expoConfig?.extra?.WEATHER_API_KEY;

export default function WeatherApp() {
    const [location, setLocation] = useState<string>("Dhaka");
    const [inputLocation, setInputLocation] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [country, setCountry] = useState<string>("BD");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchWeather(location);
    }, [location]);

    const fetchWeather = async (city: string) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
            );
            const data: ApiResponse = await response.json();

            if (data.cod !== "200") {
                throw new Error(data.message || "Invalid Location");
            }

            if (!data.list || !data.city) {
                throw new Error("Invalid weather data");
            }

            const current = data.list[0];
            setCountry(data.city.country || "BD");

            const forecast: ForecastItem[] = data.list
                .slice(0, 5)
                .map((item) => ({
                    time: new Date(item.dt * 1000).getHours() + ":00",
                    temp: Math.round(item.main.temp),
                    icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                }));

            const dailyMap: Record<
                string,
                { high: number; low: number; icon: string }
            > = {};
            data.list.forEach((item) => {
                const day = new Date(item.dt_txt).toDateString();
                if (!dailyMap[day]) {
                    dailyMap[day] = {
                        high: item.main.temp_max,
                        low: item.main.temp_min,
                        icon: item.weather[0].icon,
                    };
                } else {
                    dailyMap[day].high = Math.max(
                        dailyMap[day].high,
                        item.main.temp_max
                    );
                    dailyMap[day].low = Math.min(
                        dailyMap[day].low,
                        item.main.temp_min
                    );
                }
            });

            const days: DayForecast[] = Object.keys(dailyMap)
                .slice(0, 5)
                .map((day, i) => ({
                    day:
                        i === 0
                            ? "Today"
                            : new Date(day).toLocaleDateString("en-US", {
                                  weekday: "short",
                              }),
                    high: Math.round(dailyMap[day].high),
                    low: Math.round(dailyMap[day].low),
                    icon: dailyMap[day].icon,
                }));

            setWeather({
                temp: Math.round(current.main.temp),
                condition: current.weather[0].main,
                high: Math.round(current.main.temp_max),
                low: Math.round(current.main.temp_min),
                feelsLike: Math.round(current.main.feels_like),
                humidity: current.main.humidity,
                wind: current.wind.speed,
                icon: `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
                forecast,
                days,
            });
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error";
            console.error(errorMessage);
            ToastAndroid.show(
                `Location not found: ${errorMessage}`,
                ToastAndroid.SHORT
            );
            // Don't set weather to null, keep the previous data
        } finally {
            setLoading(false);
        }
    };

    if (loading && !weather) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <Text className="text-gray-500">Loading Weather...</Text>
            </View>
        );
    }

    if (!weather) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <Text className="text-gray-500">No weather data available</Text>
                <TouchableOpacity
                    className="mt-4 bg-[#ed3e0d] px-4 py-2 rounded"
                    onPress={() => fetchWeather(location)}
                >
                    <Text className="text-white">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-100">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="bg-[#ed3e0d] p-6 pb-12 rounded-b-3xl">
                <View className="flex-row justify-between items-center mb-8">
                    <Text className="text-white text-xl font-bold">
                        {location}, {country}
                    </Text>
                    <TouchableOpacity
                        className="bg-white/20 p-2 rounded-full"
                        onPress={() => setModalVisible(true)}
                    >
                        <Icon name="map-pin" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Current Weather */}
                <View className="flex-row justify-between items-center mb-2">
                    <View>
                        <Text className="text-white text-5xl font-bold">
                            {weather.temp}°
                        </Text>
                        <Text className="text-white text-xl">
                            {weather.condition}
                        </Text>
                        <Text className="text-white/90">
                            H: {weather.high}° L: {weather.low}°
                        </Text>
                    </View>
                    <Image
                        source={{ uri: weather.icon }}
                        className="w-32 h-32"
                    />
                </View>
                <Text className="text-white/90">
                    Feels like {weather.feelsLike}°
                </Text>
            </View>

            {/* Stats */}
            <View className="flex-row flex-wrap justify-between px-6 -mt-8 mb-6">
                <View className="bg-white w-[48%] p-4 rounded-2xl shadow-sm mb-4">
                    <Text className="text-gray-500">Humidity</Text>
                    <Text className="text-[#ed3e0d] text-2xl font-bold">
                        {weather.humidity}%
                    </Text>
                </View>
                <View className="bg-white w-[48%] p-4 rounded-2xl shadow-sm mb-4">
                    <Text className="text-gray-500">Wind</Text>
                    <Text className="text-[#ed3e0d] text-2xl font-bold">
                        {weather.wind} km/h
                    </Text>
                </View>
                <View className="bg-white w-[48%] p-4 rounded-2xl shadow-sm">
                    <Text className="text-gray-500">UV Index</Text>
                    <Text className="text-[#ed3e0d] text-2xl font-bold">7</Text>
                </View>
                <View className="bg-white w-[48%] p-4 rounded-2xl shadow-sm">
                    <Text className="text-gray-500">Pressure</Text>
                    <Text className="text-[#ed3e0d] text-2xl font-bold">
                        1012 hPa
                    </Text>
                </View>
            </View>

            {/* Hourly Forecast */}
            <View className="px-6 mb-6">
                <Text className="text-gray-700 text-lg font-semibold mb-3">
                    Hourly Forecast
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row space-x-4">
                        {weather.forecast.map((hour, index) => (
                            <View
                                key={index}
                                className="bg-white p-3 rounded-xl items-center min-w-[70px]"
                            >
                                <Text className="text-gray-600">
                                    {hour.time}
                                </Text>
                                <Image
                                    source={{ uri: hour.icon }}
                                    className="w-10 h-10"
                                />
                                <Text className="text-[#ed3e0d] font-bold">
                                    {hour.temp}°
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Weekly Forecast */}
            <View className="px-6 mb-8">
                <Text className="text-gray-700 text-lg font-semibold mb-3">
                    5-Day Forecast
                </Text>
                <View className="bg-white rounded-2xl p-4 shadow-sm">
                    {weather.days.map((day, index) => (
                        <View
                            key={index}
                            className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-0"
                        >
                            <Text
                                className={`${
                                    index === 0
                                        ? "font-bold text-[#ed3e0d]"
                                        : "text-gray-600"
                                }`}
                            >
                                {day.day}
                            </Text>
                            <Image
                                source={{
                                    uri: `https://openweathermap.org/img/wn/${day.icon}@2x.png`,
                                }}
                                className="w-8 h-8"
                            />
                            <View className="flex-row items-center space-x-4">
                                <Text className="text-gray-400">
                                    {day.low}°
                                </Text>
                                <View className="w-20 bg-gray-200 h-1 rounded-full">
                                    <View
                                        className="bg-[#ed3e0d] h-1 rounded-full"
                                        style={{
                                            width: `${
                                                (day.high - day.low) * 5
                                            }%`,
                                        }}
                                    ></View>
                                </View>
                                <Text className="font-semibold text-gray-700">
                                    {day.high}°
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Modal for Location Input */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="bg-white w-[90%] p-5 rounded-xl">
                        <Text className="text-lg font-semibold mb-3">
                            Enter a city
                        </Text>
                        <TextInput
                            value={inputLocation}
                            onChangeText={setInputLocation}
                            placeholder="e.g., Dhaka"
                            className="border border-gray-300 rounded p-2 mb-4"
                        />
                        <View className="flex-row justify-end space-x-2">
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    if (inputLocation.trim()) {
                                        setLocation(inputLocation);
                                        setModalVisible(false);
                                        setInputLocation("");
                                    } else {
                                        ToastAndroid.show(
                                            "Please enter a location",
                                            ToastAndroid.SHORT
                                        );
                                    }
                                }}
                                className="px-4 py-2 bg-[#ed3e0d] rounded"
                            >
                                <Text className="text-white">Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
