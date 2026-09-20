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
