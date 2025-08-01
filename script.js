// State variables
let currentBgIndex = 0;

// Weather data arrays
const humidityLevels = ["Moderately Dry", "Perfectly Damp", "Suspiciously Moist"];
const uvIndex = [
  "Why are you asking? You're inside bestie 🤨",
  "0 - It's called indoor weather for a reason ✨",
  "Looking for vitamin D? Try opening TikTok 📱",
  "The screen glare counts as UV, right? 💻",
  "Your LED lights don't count as sun exposure 💡",
  "Touch grass? In this economy? 🌱",
  "The only rays here are from your WiFi router 📡"
];
const airQuality = [
  "Smells like leftover coffee.",
  "Tastes like procrastination.",
  "Filled with toast crumbs.",
  "Haunted by last night's pizza."
];
const icons = ["☕", "📦", "🧦", "🌀", "🍕"];
const windConditions = [
  "Gentle AC breeze from the left",
  "Ceiling fan vibes only",
  "Someone just walked by really fast",
  "Door draft aesthetic",
  "Typing speed wind tunnel",
  "Router fan white noise",
  "Desk fan doing its best"
];
const backgrounds = [
    "url('https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=1920&q=80')", // Cloudy sky
    "url('https://images.unsplash.com/photo-1598965914211-6ee3556ecad5?auto=format&fit=crop&w=1920&q=80')", // Sunset clouds
    "url('https://images.unsplash.com/photo-1612287465765-0a6df40d8ec5?auto=format&fit=crop&w=1920&q=80')", // Storm clouds
    "url('https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?auto=format&fit=crop&w=1920&q=80')", // Rainbow in clouds
    "url('https://images.unsplash.com/photo-1595674637798-9669249c86b0?auto=format&fit=crop&w=1920&q=80')", // Morning fog
    "url('https://images.unsplash.com/photo-1581147036324-c1c88bb447fe?auto=format&fit=crop&w=1920&q=80')"  // Sunset rays
];
const locations = [
  "Under your blanket",
  "By the kitchen sink",
  "Next to the charging cable",
  "Inside the hoodie zone",
  "Near the dusty corner"
];
const alerts = [
  "Your mood may dip. Recommend blanket and tea 🫖",
  "High chance of introspection around 3 PM 💭",
  "Beware: existential dust storm forming 🌪️",
  "Blanket levels dangerously low. Recharge soon 🔋",
  "Potential snack craving incoming 🍪",
  "Perfect conditions for a nap 😴",
  "Productivity levels unpredictable ⚡"
];
const snarkyResponses = [
  "It's the same as it was 5 seconds ago. You're inside. 🙄",
  "No wind, no rain, no worries—unless your roommate starts talking.",
  "Indoors: 23°C. Emotional forecast: dramatic.",
  "Smells like... existential dread and fabric softener.",
  "Feels like a perfect day to avoid responsibilities!",
  "Temperature is cozy. Mood is chaotic.",
  "Definitely hoodie weather. But when isn't it?"
];

function changeBackground() {
    const app = document.getElementById("appContainer");
    const nextIndex = (currentBgIndex + 1) % backgrounds.length;
    
    // Create new image and wait for it to load
    const img = new Image();
    img.onload = () => {
        currentBgIndex = nextIndex;
        app.style.backgroundImage = backgrounds[currentBgIndex];
    };
    img.src = backgrounds[nextIndex].match(/url\('(.+)'\)/)[1];
}

function generateMockWeather() {
  const temp = (Math.random() * 5 + 21).toFixed(1);
  const humidity = humidityLevels[Math.floor(Math.random() * humidityLevels.length)];
  const air = airQuality[Math.floor(Math.random() * airQuality.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const iconSet = icons.sort(() => 0.5 - Math.random()).slice(0, 3);
  const alert = alerts[Math.floor(Math.random() * alerts.length)];

  document.getElementById("temperature").innerText = `${temp}°C`;
  document.getElementById("location").innerText = location;
  const randomUV = uvIndex[Math.floor(Math.random() * uvIndex.length)];
  const wind = windConditions[Math.floor(Math.random() * windConditions.length)];
  document.getElementById("conditions").innerHTML = `
    <div class="condition-item">
      <span class="condition-label">Humidity</span>
      <span class="condition-value">${humidity}</span>
    </div>
    <div class="condition-item">
      <span class="condition-label">Wind</span>
      <span class="condition-value">${wind}</span>
    </div>
    <div class="condition-item">
      <span class="condition-label">UV Index</span>
      <span class="condition-value">${randomUV}</span>
    </div>
    <div class="condition-item">
      <span class="condition-label">Air Quality</span>
      <span class="condition-value">${air}</span>
    </div>`;
  document.getElementById("icons").innerText = iconSet.join(" ");
  document.getElementById("alert").innerText = alert;

  const hourlies = Array.from({ length: 6 }).map((_, i) => {
    const futureHour = new Date().getHours() + i + 1;
    const hour12 = futureHour % 12 || 12;
    const ampm = futureHour >= 12 ? 'PM' : 'AM';
    const fakeTemp = (parseFloat(temp) + Math.random() * 0.5 - 0.2).toFixed(1);
    return `<div class="hourly-item">${hour12}${ampm} — ${fakeTemp}°C, same vibes ✨</div>`;
  });

  document.getElementById("hourly").innerHTML = hourlies.join("");
}

function respondToQuestion(question) {
  const isWeatherQuestion = /(weather|temperature|forecast|humidity|air|condition)/i.test(question);
  return isWeatherQuestion
    ? snarkyResponses[Math.floor(Math.random() * snarkyResponses.length)]
    : "Try asking me about the weather inside! I'm not ChatGPT 😏";
}

function askQuestion() {
  const input = document.getElementById("question-input");
  const question = input.value.trim();
  if (!question) return;

  const chatMessages = document.getElementById("chat-messages");
  const response = respondToQuestion(question);

  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = `
    <div class="chat-q">${question}</div>
    <div class="chat-a">${response}</div>
  `;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const isWeatherQuestion = /(weather|temperature|forecast|humidity|air|condition)/i.test(question);
  if (isWeatherQuestion) {
    document.getElementById("weather-info").style.display = "block";
    generateMockWeather();
    changeBackground(); // Change background when weather is asked
  }

  input.value = "";
}

// Preload background images
function preloadImages() {
  backgrounds.forEach(bg => {
    const img = new Image();
    img.src = bg.match(/url\('(.+)'\)/)[1];
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("appContainer");
  
  // Preload all background images
  preloadImages();
  
  // Set initial background
  app.style.backgroundImage = backgrounds[0];
  
  // Change background every 30 seconds
  setInterval(changeBackground, 30000);

  document.getElementById("ask-btn").addEventListener("click", askQuestion);
  document.getElementById("question-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") askQuestion();
  });
});
