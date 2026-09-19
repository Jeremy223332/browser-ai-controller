chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "AI_COMMAND") {
    return;
  }

  const command = message.command.toLowerCase();

  if (command.includes("youtube")) {
    const searchText = extractYouTubeSearch(command);

    if (!searchText) {
      sendResponse({
        success: false,
        message: "I couldn't figure out what to search for."
      });
      return;
    }

    const url =
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(searchText);

    chrome.tabs.create({ url }, () => {
      sendResponse({
        success: true,
        message: `Opening YouTube and searching for "${searchText}"...`
      });
    });

    return true;
  }

  sendResponse({
    success: false,
    message: "I don't know how to perform that action yet."
  });
});

function extractYouTubeSearch(command) {
  const patterns = [
    /search youtube for (.+)/i,
    /search youtube (.+)/i,
    /find (.+) on youtube/i,
    /look up (.+) on youtube/i
  ];

  for (const pattern of patterns) {
    const match = command.match(pattern);

    if (match) {
      return match[1]
        .replace(/\s+and\s+play.*$/i, "")
        .trim();
    }
  }

  return null;
}
