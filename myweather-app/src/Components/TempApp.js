import React, { useEffect, useState } from "react";
import "../Css/style.css";

/**
 * TempApp component displays weather information for multiple locations.
 * It allows users to toggle between light and dark modes.
 * 
 
 */
const TempApp = () => {
  // State variables
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const [locations, setLocations] = useState(["New York", "London", "Delhi"]); // Array of locations
  const [weatherData, setWeatherData] = useState({}); // Weather data state
  const [currentDateTime, setCurrentDateTime] = useState(new Date()); // Current date and time state

  // Fetch weather data for the selected locations and update weatherData state
  useEffect(() => {
    // Function to fetch weather data for a single location
    const fetchDataForLocation = async (location) => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=554f2becfecc28dc997ab0bc5efe7a5e&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        setWeatherData((prevData) => ({
          ...prevData,
          [location]: data
        }));
      } catch (error) {
        console.error(`Error fetching weather data for ${location}:`, error);
      }
    };

    // Function to fetch weather data for all locations
    const fetchWeatherData = async () => {
      await Promise.all(locations.map(fetchDataForLocation));
    };

    // Initial fetch of weather data
    fetchWeatherData();

    // Set interval to update current date and time every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, [locations]);

  // Toggle dark mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Adjust time for the given location based on timezone
  const adjustTimeForLocation = (location, currentTime) => {
    const timezoneOffset = (weatherData[location]?.timezone || 0) * 1000; // Convert seconds to milliseconds
    const adjustedTime = new Date(currentTime.getTime() + timezoneOffset);
    return adjustedTime;
  };

  // JSX to render the component
  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div className="card">
        {/* Input field for entering locations */}
        <div className="inputData">
          <input
            type="text"
            className="inputField"
            placeholder="Enter locations separated by comma"
            onChange={(event) =>
              setLocations(event.target.value.split(",").map((loc) => loc.trim()))
            }
          />
        </div>
        {/* Display weather information for each location */}
        {locations.map((location) => (
          <div key={location} className="information">
            {/* Location name */}
            <h2 className={`location ${darkMode ? "dark-mode-text" : ""}`}>
              <i className="fa-solid fa-location-dot"></i> {location}
            </h2>
            {/* Weather details */}
            {weatherData[location] ? (
              <>
                <h1 className="temp">{weatherData[location].main?.temp}°C</h1>
                <p>Humidity: {weatherData[location].main?.humidity}%</p>
                <p>Wind Speed: {weatherData[location].wind?.speed} m/s</p>
                <p>Weather: {weatherData[location].weather?.[0]?.description}</p>
                <p>
                  Local Time:{" "}
                  {adjustTimeForLocation(location, currentDateTime).toLocaleString(navigator.language, { timeZoneName: "short" })}
                </p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        ))}
      </div>
      {/* Button to toggle dark mode */}
      <button onClick={toggleTheme} className="toggleButton">
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </div>
  );
};

export default TempApp;
