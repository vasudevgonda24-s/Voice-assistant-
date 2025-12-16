let recognition;
let listening = false;
let currentLang = "en-IN";

const talkBtn = document.getElementById("talkBtn");
const statusEl = document.getElementById("status");
const userTextEl = document.getElementById("userText");
const botTextEl = document.getElementById("botText");

const synth = window.speechSynthesis;

function speak(text, lang) {
  stopListening(); // 🔥 critical

  botTextEl.textContent = text;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 1;

  utter.onend = () => {
    startListening(); // 🔥 resume AFTER speaking
  };

  synth.cancel();
  synth.speak(utter);
}

function startListening() {
  if (listening) return;

  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = currentLang;
  recognition.continuous = false;

  recognition.onstart = () => {
    listening = true;
    statusEl.textContent = "Status: Listening...";
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase().trim();
    userTextEl.textContent = text;
    handleCommand(text);
  };

  recognition.onend = () => {
    listening = false;
  };

  recognition.start();
}

function stopListening() {
  if (recognition && listening) {
    recognition.stop();
    listening = false;
  }
}

talkBtn.addEventListener("click", () => {
  currentLang = "en-IN";
  speak("Hello. You can speak now.", "en-IN");
});

function handleCommand(text) {

  // English
  if (text.includes("hello")) {
    currentLang = "en-IN";
    speak("Hello, how can I help you?", "en-IN");
    return;
  }

  // Kannada
  if (text.includes("ನಮಸ್ಕಾರ")) {
    currentLang = "kn-IN";
    speak("ನಮಸ್ಕಾರ, ನಾನು ಕೇಳುತ್ತಿದ್ದೇನೆ", "kn-IN");
    return;
  }

  // Hindi
  if (text.includes("नमस्ते")) {
    currentLang = "hi-IN";
    speak("नमस्ते, मैं सुन रहा हूँ", "hi-IN");
    return;
  }

  if (text.includes("time") || text.includes("ಸಮಯ") || text.includes("समय")) {
    const time = new Date().toLocaleTimeString();
    speak("The time is " + time, currentLang);
    return;
  }

  speak(
    currentLang === "kn-IN"
      ? "ನಾನು ಇನ್ನೂ ಕಲಿಯುತ್ತಿದ್ದೇನೆ"
      : currentLang === "hi-IN"
      ? "मैं अभी सीख रहा हूँ"
      : "I am still learning",
    currentLang
  );
}
