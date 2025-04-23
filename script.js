document.addEventListener('DOMContentLoaded', function() {
    const weatherInfo = document.getElementById('weather-info');
    const locationInfo = document.getElementById('location-info'); // New element for detailed location
    const locationAlert = document.getElementById('locationAlert');
    const downloadButton = document.getElementById('download-cv');
    
    // Function to show location alert
    function showLocationAlert(message) {
        locationAlert.textContent = message;
        locationAlert.classList.add('show');
        setTimeout(() => {
            locationAlert.classList.remove('show');
        }, 3500);
    }

    // Function to get detailed address from coordinates using OpenStreetMap's Nominatim
    async function getDetailedLocation(lat, lon) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`);
            
            if (!response.ok) {
                throw new Error('Location data not available');
            }
            
            const data = await response.json();
            const address = data.address;
            
            // Format detailed location information
            let locationDetails = '';
            
            if (address.road) locationDetails += `${address.road}, `;
            if (address.city || address.town || address.village) 
                locationDetails += `${address.city || address.town || address.village}, `;
            if (address.state || address.province) 
                locationDetails += `${address.state || address.province}, `;
            if (address.country) locationDetails += address.country;
            
            // Update location info
            if (locationInfo) {
                locationInfo.innerHTML = `
                    <p><i class="fas fa-map-marker-alt"></i> ${locationDetails}</p>
                `;
            } else {
                // If locationInfo element doesn't exist, prepend to weatherInfo
                const locationHTML = `<p><i class="fas fa-map-marker-alt"></i> ${locationDetails}</p>`;
                weatherInfo.innerHTML = locationHTML + weatherInfo.innerHTML;
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching location data:', error);
            if (locationInfo) {
                locationInfo.innerHTML = `
                    <p><i class="fas fa-exclamation-circle"></i> Detailed location unavailable</p>
                `;
            }
        }
    }
    
    // Function to get weather data
    async function getWeatherData(lat, lon) {
        try {
            const apiKey = '7f44905aaf64605fe9d5947b63cd2ba9'; 
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
            
            if (!response.ok) {
                throw new Error('Weather data not available');
            }
            
            const data = await response.json();
            
            // Display weather information without location (handled separately now)
            weatherInfo.innerHTML = `
                <p><i class="fas fa-temperature-high"></i> ${Math.round(data.main.temp)}°C</p>
                <p><i class="fas fa-cloud"></i> ${data.weather[0].description}</p>
            `;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherInfo.innerHTML = `
                <p><i class="fas fa-exclamation-circle"></i> Weather data unavailable</p>
                <p>Please check your API key or try again later.</p>
            `;
        }
    }
    
    // Get user's location, detailed address, and weather
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async function(position) {
                const { latitude, longitude } = position.coords;
                showLocationAlert('Location access granted! Fetching data...');
                
                // Get both detailed location and weather data
                await getDetailedLocation(latitude, longitude);
                await getWeatherData(latitude, longitude);
            },
            function(error) {
                console.error('Error getting location:', error);
                weatherInfo.innerHTML = `
                    <p><i class="fas fa-exclamation-circle"></i> Location access denied</p>
                    <p>Please enable location services to see location and weather data.</p>
                `;
                if (locationInfo) {
                    locationInfo.innerHTML = '';
                }
            }
        );
    } else {
        weatherInfo.innerHTML = `
            <p><i class="fas fa-exclamation-circle"></i> Geolocation not supported</p>
            <p>Your browser doesn't support location services.</p>
        `;
        if (locationInfo) {
            locationInfo.innerHTML = '';
        }
    }
    
    // Handle CV download
    downloadButton.addEventListener('click', function(e) {
        e.preventDefault();
        const pdfUrl = 'My Resume.pdf';
        window.open(pdfUrl, '_blank');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
});
