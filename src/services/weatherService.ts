// Weather Service for OpenWeather API Integration
// In production, replace 'YOUR_API_KEY_HERE' with your actual OpenWeather API key
// Get your free API key at: https://openweathermap.org/api

export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    description: string;
    icon: string;
    clouds: number;
    visibility: number;
  };
  forecast: ForecastDay[];
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
}

export interface ForecastDay {
  date: Date;
  tempMin: number;
  tempMax: number;
  humidity: number;
  description: string;
  icon: string;
  precipitation: number;
  precipitationProbability: number;
}

const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your OpenWeather API key
const CHIANG_RAI_LAT = 19.9105;
const CHIANG_RAI_LON = 99.8406;

// Mock weather data for demonstration
// In production, this will be replaced with real API calls
const generateMockWeatherData = (): WeatherData => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Simulate realistic weather patterns for Chiang Rai
  const isRainySeason = [5, 6, 7, 8, 9].includes(now.getMonth()); // May-September
  const baseTemp = isRainySeason ? 26 : 24;
  const baseHumidity = isRainySeason ? 75 : 65;
  
  const weatherConditions = isRainySeason
    ? [
        { description: "scattered clouds", icon: "02d", clouds: 40 },
        { description: "light rain", icon: "10d", clouds: 75 },
        { description: "moderate rain", icon: "10d", clouds: 85 },
        { description: "overcast clouds", icon: "04d", clouds: 90 },
      ]
    : [
        { description: "clear sky", icon: "01d", clouds: 10 },
        { description: "few clouds", icon: "02d", clouds: 25 },
        { description: "scattered clouds", icon: "03d", clouds: 40 },
        { description: "partly cloudy", icon: "02d", clouds: 35 },
      ];

  const currentCondition =
    weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

  // Generate 5-day forecast
  const forecast: ForecastDay[] = [];
  for (let i = 1; i <= 5; i++) {
    const forecastDate = new Date(now);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    const condition =
      weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    forecast.push({
      date: forecastDate,
      tempMin: baseTemp - 3 + Math.random() * 2,
      tempMax: baseTemp + 5 + Math.random() * 3,
      humidity: baseHumidity + Math.random() * 15 - 7,
      description: condition.description,
      icon: condition.icon,
      precipitation: isRainySeason ? Math.random() * 20 : Math.random() * 5,
      precipitationProbability: isRainySeason
        ? Math.random() * 40 + 30
        : Math.random() * 30,
    });
  }

  return {
    current: {
      temp: baseTemp + Math.random() * 4 - 2,
      feelsLike: baseTemp + Math.random() * 4 - 1,
      humidity: baseHumidity + Math.random() * 10 - 5,
      pressure: 1010 + Math.random() * 10,
      windSpeed: 2 + Math.random() * 4,
      description: currentCondition.description,
      icon: currentCondition.icon,
      clouds: currentCondition.clouds,
      visibility: 8000 + Math.random() * 2000,
    },
    forecast,
    location: {
      name: "Chiang Rai",
      country: "TH",
      lat: CHIANG_RAI_LAT,
      lon: CHIANG_RAI_LON,
    },
  };
};

export const fetchWeatherData = async (): Promise<WeatherData> => {
  // In production, uncomment this to use real API
  /*
  try {
    // Fetch current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${CHIANG_RAI_LAT}&lon=${CHIANG_RAI_LON}&appid=${API_KEY}&units=metric`
    );
    
    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${CHIANG_RAI_LAT}&lon=${CHIANG_RAI_LON}&appid=${API_KEY}&units=metric`
    );

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Weather API request failed');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    // Process and return real data
    return {
      current: {
        temp: currentData.main.temp,
        feelsLike: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        windSpeed: currentData.wind.speed,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        clouds: currentData.clouds.all,
        visibility: currentData.visibility,
      },
      forecast: forecastData.list
        .filter((item: any, index: number) => index % 8 === 0)
        .slice(0, 5)
        .map((item: any) => ({
          date: new Date(item.dt * 1000),
          tempMin: item.main.temp_min,
          tempMax: item.main.temp_max,
          humidity: item.main.humidity,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          precipitation: item.rain?.['3h'] || 0,
          precipitationProbability: item.pop * 100,
        })),
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      },
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return generateMockWeatherData();
  }
  */

  // For demonstration, return mock data
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return generateMockWeatherData();
};

export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const getIrrigationRecommendation = (
  weatherData: WeatherData,
  currentMoisture: number
): {
  shouldIrrigate: boolean;
  reason: string;
  confidence: "high" | "medium" | "low";
} => {
  const upcomingRain = weatherData.forecast.slice(0, 2);
  const highRainProbability = upcomingRain.some((day) => day.precipitationProbability > 60);
  const expectedRainfall = upcomingRain.reduce((sum, day) => sum + day.precipitation, 0);

  if (currentMoisture > 60) {
    return {
      shouldIrrigate: false,
      reason: "Soil moisture is optimal",
      confidence: "high",
    };
  }

  if (highRainProbability && expectedRainfall > 10) {
    return {
      shouldIrrigate: false,
      reason: "Heavy rain expected within 48 hours",
      confidence: "high",
    };
  }

  if (currentMoisture < 30 && !highRainProbability) {
    return {
      shouldIrrigate: true,
      reason: "Low soil moisture and no rain expected",
      confidence: "high",
    };
  }

  if (currentMoisture < 30 && upcomingRain[0].precipitationProbability > 40) {
    return {
      shouldIrrigate: true,
      reason: "Low moisture but rain possible - irrigate lightly",
      confidence: "medium",
    };
  }

  if (currentMoisture < 45) {
    return {
      shouldIrrigate: true,
      reason: "Moisture below optimal level",
      confidence: "medium",
    };
  }

  return {
    shouldIrrigate: false,
    reason: "Soil moisture adequate",
    confidence: "medium",
  };
};
