const commandBox = document.getElementById("command");
const runButton = document.getElementById("run");
const status = document.getElementById("status");

function showStatus(message, type = "working") {
  const line = document.createElement("div");
  line.className = `action ${type}`;
  line.textContent = message;

  status.appendChild(line);
  status.scrollTop = status.scrollHeight;
}

function clearStatus() {
  status.innerHTML = "";
}

runButton.addEventListener("click", async () => {
  const command = commandBox.value.trim();

  if (!command) {
    clearStatus();
    showStatus("⚠️ Enter a command first.");
    return;
  }

  clearStatus();
  showStatus("🤖 Understanding command...");

  try {
    const response = await chrome.runtime.sendMessage({
      type: "AI_COMMAND",
      command: command
    });

    if (response && response.success) {
      showStatus("✓ " + response.message, "success");
    } else {
      showStatus(
        "❌ " + (response?.message || "Something went wrong.")
      );
    }
  } catch (error) {
    console.error(error);
    showStatus("❌ Browser controller error.");
  }
});
