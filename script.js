document.addEventListener('DOMContentLoaded', function() {
    const weatherInfo = document.getElementById('weather-info');
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

    // Function to get weather data
    async function getWeatherData(lat, lon) {
        try {
            // Using OpenWeatherMap API - you would need to replace 'YOUR_API_KEY' with an actual API key
            const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
            
            if (!response.ok) {
                throw new Error('Weather data not available');
            }
            
            const data = await response.json();
            
            // Format and display weather information
            weatherInfo.innerHTML = `
                <p><i class="fas fa-map-marker-alt"></i> ${data.name}, ${data.sys.country}</p>
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

    // Get user's location and weather
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const { latitude, longitude } = position.coords;
                showLocationAlert('Location access granted! Fetching weather data...');
                getWeatherData(latitude, longitude);
            },
            function(error) {
                console.error('Error getting location:', error);
                weatherInfo.innerHTML = `
                    <p><i class="fas fa-exclamation-circle"></i> Location access denied</p>
                    <p>Please enable location services to see weather data.</p>
                `;
            }
        );
    } else {
        weatherInfo.innerHTML = `
            <p><i class="fas fa-exclamation-circle"></i> Geolocation not supported</p>
            <p>Your browser doesn't support location services.</p>
        `;
    }

    // Handle CV download (this would typically link to your actual PDF file)
    downloadButton.addEventListener('click', function(e) {
        e.preventDefault();
        // You would replace this with your actual CV PDF URL
        const pdfUrl = 'your-cv.pdf';
        
        // For demonstration, we'll show an alert
        alert('CV download would start here. Please replace with your actual PDF file URL.');
        
        // Uncomment this line when you have your actual PDF ready
        // window.open(pdfUrl, '_blank');
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
