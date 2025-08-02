
const URL = "https://teachablemachine.withgoogle.com/models/EBEFnBHgr/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  if (typeof tmImage === "undefined") {
    alert("Teachable Machine library not loaded. Please check your script order and internet connection.");
    return;
  }

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Setup webcam
  const flip = true;
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("video-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("expression-result");

  for (let i = 0; i < maxPredictions; i++) {
    const el = document.createElement("div");
    labelContainer.appendChild(el);
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  prediction.sort((a, b) => b.probability - a.probability);

  const mood = prediction[0].className;
  const probability = (prediction[0].probability * 100).toFixed(2);

  labelContainer.innerHTML = `Mood: <strong>${mood}</strong> (${probability}%)`;

  // Optional: trigger weather change here
  updateWeatherBasedOnMood(mood);
}

function updateWeatherBasedOnMood(mood) {
  const weatherOutput = document.getElementById("weather-output");

  let weather = "Unknown";
  switch (mood) {
    case "happy":
      weather = "Sunny ☀️";
      break;
    case "sad":
      weather = "Rainy 🌧️";
      break;
    case "angry":
      weather = "Stormy ⛈️";
      break;
    case "Neutral":
      weather = "Cloudy ☁️";
      break;
    default:
      weather = "Calm 🌤️";
  }

  weatherOutput.innerHTML = `<h2>Detected Mood: ${mood}</h2><p>Suggested Weather: ${weather}</p>`;
}

document.getElementById("detect-face-btn").addEventListener("click", init);
