const commandBox = document.getElementById("command");
const runButton = document.getElementById("run");
const status = document.getElementById("status");

runButton.addEventListener("click", async () => {
  const command = commandBox.value.trim();

  if (!command) {
    status.textContent = "⚠️ Enter a command first.";
    return;
  }

  status.textContent = "🤖 Processing command...";

  try {
    const response = await chrome.runtime.sendMessage({
      type: "AI_COMMAND",
      command: command
    });

    if (response && response.success) {
      status.textContent = "✅ " + response.message;
    } else {
      status.textContent =
        "❌ " + (response?.message || "Something went wrong.");
    }
  } catch (error) {
    console.error(error);
    status.textContent = "❌ Could not contact the browser controller.";
  }
});
