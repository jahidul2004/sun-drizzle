import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";

export default function WeatherApp() {
    // Sample weather data
    const currentWeather = {
        temp: 28,
        condition: "Sunny",
        high: 32,
        low: 24,
        location: "Dhaka, BD",
        humidity: 65,
        wind: 8,
        feelsLike: 30,
        icon: "https://cdn-icons-png.flaticon.com/512/2698/2698194.png",
    };

    const hourlyForecast = [
        { time: "Now", temp: 28, icon: "☀️" },
        { time: "1PM", temp: 30, icon: "☀️" },
        { time: "2PM", temp: 31, icon: "⛅" },
        { time: "3PM", temp: 31, icon: "⛅" },
        { time: "4PM", temp: 30, icon: "⛅" },
    ];

    const weeklyForecast = [
        { day: "Today", high: 32, low: 24, icon: "☀️" },
        { day: "Tue", high: 31, low: 25, icon: "⛅" },
        { day: "Wed", high: 30, low: 25, icon: "🌧️" },
        { day: "Thu", high: 29, low: 24, icon: "⛅" },
        { day: "Fri", high: 31, low: 25, icon: "☀️" },
    ];

    return (
        <ScrollView className="flex-1 bg-gray-100">
            <StatusBar style="dark" />

            {/* Header */}
            <View className="bg-[#ed3e0d] p-6 pb-12 rounded-b-3xl">
                <View className="flex-row justify-between items-center mb-8">
                    <Text className="text-white text-xl font-bold">
                        {currentWeather.location}
                    </Text>
                    <View className="bg-white/20 p-2 rounded-full">
                        <Text className="text-white">⚙️</Text>
                    </View>
                </View>

                {/* Current Weather */}
                <View className="flex-row justify-between items-center mb-2">
                    <View>
                        <Text className="text-white text-5xl font-bold">
                            {currentWeather.temp}°
                        </Text>
                        <Text className="text-white text-xl">
                            {currentWeather.condition}
                        </Text>
                        <Text className="text-white/90">
                            H: {currentWeather.high}° L: {currentWeather.low}°
                        </Text>
                    </View>
                    <Image
                        source={{ uri: currentWeather.icon }}
                        className="w-32 h-32"
                    />
                </View>
                <Text className="text-white/90">
                    Feels like {currentWeather.feelsLike}°
                </Text>
            </View>

            {/* Stats Cards */}
            <View className="flex-row flex-wrap justify-between px-6 -mt-8 mb-6">
                <View className="bg-white w-[48%] p-4 rounded-2xl shadow-sm mb-4">
                    <Text className="text-gray-500">Humidity</Text>
                    <Text className="text-[#ed3e0d] text-2xl font-bold">
                        {currentWeather.humidity}%
                    </Text>
                </View>
                <View className="bg-white w-[48%] p-4 rounded-2xl shadow-sm mb-4">
                    <Text className="text-gray-500">Wind</Text>
                    <Text className="text-[#ed3e0d] text-2xl font-bold">
                        {currentWeather.wind} km/h
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
                        {hourlyForecast.map((hour, index) => (
                            <View
                                key={index}
                                className="bg-white p-3 rounded-xl items-center min-w-[70px]"
                            >
                                <Text className="text-gray-600">
                                    {hour.time}
                                </Text>
                                <Text className="text-2xl mb-1">
                                    {hour.icon}
                                </Text>
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
                    {weeklyForecast.map((day, index) => (
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
                            <Text className="text-xl">{day.icon}</Text>
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

            {/* Additional Info */}
            <View className="px-6 mb-8">
                <Text className="text-gray-700 text-lg font-semibold mb-3">
                    Weather Details
                </Text>
                <View className="bg-white rounded-2xl p-4 shadow-sm">
                    <View className="flex-row justify-between py-3 border-b border-gray-100">
                        <Text className="text-gray-600">Sunrise</Text>
                        <Text className="font-semibold">5:45 AM</Text>
                    </View>
                    <View className="flex-row justify-between py-3 border-b border-gray-100">
                        <Text className="text-gray-600">Sunset</Text>
                        <Text className="font-semibold">6:30 PM</Text>
                    </View>
                    <View className="flex-row justify-between py-3">
                        <Text className="text-gray-600">Visibility</Text>
                        <Text className="font-semibold">10 km</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
