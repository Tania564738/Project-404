
    const URL = "https://teachablemachine.withgoogle.com/models/EBEFnBHgr/";
    let model, webcam, labelContainer, maxPredictions;
    let isDetecting = false;

    async function init() {
      if (isDetecting) return;
      
      const detectBtn = document.getElementById('detect-face-btn');
      const videoContainer = document.getElementById('video-container');
      const resultSection = document.getElementById('result-section');
      
      // Show loading state
      detectBtn.innerHTML = '<div class="loading-spinner"></div>Starting Camera...';
      detectBtn.disabled = true;
      isDetecting = true;
      
      try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        if (typeof tmImage === "undefined") {
          throw new Error("Teachable Machine library not loaded. Please check your internet connection.");
        }

        // Load model
        detectBtn.innerHTML = '<div class="loading-spinner"></div>Loading AI Model...';
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Setup webcam
        detectBtn.innerHTML = '<div class="loading-spinner"></div>Accessing Camera...';
        const flip = true;
        webcam = new tmImage.Webcam(280, 280, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        // Update UI
        videoContainer.innerHTML = "";
        webcam.canvas.style.width = "100%";
        webcam.canvas.style.height = "100%";
        webcam.canvas.style.objectFit = "cover";
        webcam.canvas.style.borderRadius = "16px";
        videoContainer.appendChild(webcam.canvas);
        
        labelContainer = document.getElementById("expression-result");
        resultSection.classList.add('show');
        
        // Update button
        detectBtn.innerHTML = '🔄 Stop Detection';
        detectBtn.onclick = stopDetection;
        
      } catch (error) {
        console.error("Error initializing:", error);
        detectBtn.innerHTML = '❌ Error - Try Again';
        detectBtn.disabled = false;
        isDetecting = false;
        alert(error.message);
      }
    }

    function stopDetection() {
      const detectBtn = document.getElementById('detect-face-btn');
      const videoContainer = document.getElementById('video-container');
      
      if (webcam) {
        webcam.stop();
      }
      
      videoContainer.innerHTML = '<div class="video-placeholder">Camera feed will appear here</div>';
      detectBtn.innerHTML = '🎭 Detect My Mood';
      detectBtn.onclick = init;
      detectBtn.disabled = false;
      isDetecting = false;
    }

    async function loop() {
      if (webcam && isDetecting) {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
      }
    }

    async function predict() {
      if (!model || !webcam) return;
      
      const prediction = await model.predict(webcam.canvas);
      prediction.sort((a, b) => b.probability - a.probability);

      const mood = prediction[0].className;
      const probability = (prediction[0].probability * 100).toFixed(1);

      // Update mood display with modern styling
      labelContainer.style.display = 'block';
      labelContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 0.5rem;">
          <span style="font-size: 1.5rem;">${getMoodEmoji(mood)}</span>
          <span style="font-size: 1.2rem; font-weight: 600;">${mood.toUpperCase()}</span>
        </div>
        <div style="font-size: 0.9rem; opacity: 0.8;">Confidence: ${probability}%</div>
        <div style="width: 100%; background: rgba(255,255,255,0.2); height: 4px; border-radius: 2px; margin-top: 0.5rem; overflow: hidden;">
          <div style="width: ${probability}%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 2px; transition: width 0.3s ease;"></div>
        </div>
      `;

      updateWeatherBasedOnMood(mood);
    }

    function getMoodEmoji(mood) {
      const emojis = {
        'happy': '😊',
        'sad': '😢',
        'angry': '😠',
        'neutral': '😐',
        'surprised': '😲',
        'fear': '😨',
        'disgust': '🤢'
      };
      return emojis[mood.toLowerCase()] || '🙂';
    }

    function updateWeatherBasedOnMood(mood) {
      const weatherOutput = document.getElementById("weather-output");
      const body = document.body;
      
      let weather = "Unknown";
      let bgGradient = "";
      let comment = "";
      
      switch (mood.toLowerCase()) {
        case "happy":
          weather = "Sunny ☀️";
          bgGradient = "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
          comment = "Radiating positive vibes! Perfect weather for outdoor adventures or sharing your joy with friends.";
          break;
        case "sad":
          weather = "Rainy 🌧️";
          bgGradient = "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
          comment = "Feeling blue? Sometimes we need rainy days to appreciate the sunshine. Take it easy and be kind to yourself.";
          break;
        case "angry":
          weather = "Stormy ⛈️";
          bgGradient = "linear-gradient(135deg, #fa709a 0%, #fee140 100%)";
          comment = "Storm clouds detected! Take some deep breaths - even the fiercest storms eventually pass.";
          break;
        case "neutral":
          weather = "Cloudy ☁️";
          bgGradient = "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)";
          comment = "Calm and balanced. Sometimes neutral is exactly what we need - steady and peaceful.";
          break;
        case "surprised":
          weather = "Windy 🌪️";
          bgGradient = "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)";
          comment = "Caught off guard? Life's full of surprises - embrace the unexpected!";
          break;
        case "fear":
          weather = "Foggy 🌫️";
          bgGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
          comment = "Feeling uncertain? Fog eventually clears, revealing the path ahead.";
          break;
        default:
          weather = "Calm 🌤️";
          bgGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
          comment = "Peaceful vibes detected. You're in a good headspace!";
      }
      
      // Update background with smooth transition
      body.style.background = bgGradient;
      body.style.transition = "background 1s ease";
      
      weatherOutput.style.display = 'block';
      weatherOutput.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1rem;">
          <span style="font-size: 2rem;">${weather.split(' ')[1]}</span>
          <span style="font-size: 1.1rem; font-weight: 600;">${weather.split(' ')[0]} Weather</span>
        </div>
        <p style="line-height: 1.6; opacity: 0.9;">${comment}</p>
      `;
    }

    // Enhanced UI interactions
    document.addEventListener('DOMContentLoaded', function() {
      const detectBtn = document.getElementById('detect-face-btn');
      detectBtn.addEventListener('click', init);
      
      // Add hover effects to result cards
      const resultSection = document.getElementById('result-section');
      resultSection.addEventListener('mouseenter', function() {
        const cards = this.querySelectorAll('.expression-result, .weather-output');
        cards.forEach(card => {
          if (card.style.display !== 'none') {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 8px 25px -8px rgba(0, 0, 0, 0.3)';
          }
        });
      });
      
      resultSection.addEventListener('mouseleave', function() {
        const cards = this.querySelectorAll('.expression-result, .weather-output');
        cards.forEach(card => {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = 'none';
        });
      });
    });
