const voiceButton = document.getElementById("voice-button");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  voiceButton.textContent = "❌";
  voiceButton.title = "Voice recognition is not supported in this browser";
} else {
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceButton.addEventListener("click", () => {
    try {
      recognition.start();
      voiceButton.textContent = "🔴";
    } catch (error) {
      console.error("Voice start error:", error);
    }
  });

  recognition.onstart = () => {
    voiceButton.textContent = "🔴";
    messageInput.placeholder = "Listening...";
  };

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;

    messageInput.value = spokenText;

    voiceButton.textContent = "🎤";
    messageInput.placeholder = "Type your message...";
  };

  recognition.onerror = (event) => {
    console.error("Voice recognition error:", event.error);

    voiceButton.textContent = "🎤";
    messageInput.placeholder = "Voice error: " + event.error;
  };

  recognition.onend = () => {
    voiceButton.textContent = "🎤";

    if (messageInput.placeholder === "Listening...") {
      messageInput.placeholder = "Type your message...";
    }
  };
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceButton.addEventListener("click", () => {
    recognition.start();
    voiceButton.textContent = "🔴";
  });

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;
    messageInput.value = spokenText;
    voiceButton.textContent = "🎤";
  };

  recognition.onerror = () => {
    voiceButton.textContent = "🎤";
  };

  recognition.onend = () => {
    voiceButton.textContent = "🎤";
  };
} else {
  voiceButton.disabled = true;
  voiceButton.textContent = "❌";
}

const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const messages = document.getElementById("messages");

const history = [];

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = sender === "user" ? "user-message" : "bot-message";
  message.textContent = text;
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

chatForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  addMessage(message, "user");
  messageInput.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        history: history
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    addMessage(data.reply, "bot");

    history.push({
      role: "user",
      content: message
    });

    history.push({
      role: "assistant",
      content: data.reply
    });

  } catch (error) {
    console.error(error);
    addMessage(
      "Sorry, I could not connect to the AI service.",
      "bot"
    );
  }
});
