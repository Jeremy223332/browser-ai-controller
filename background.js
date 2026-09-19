chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "AI_COMMAND") {
    return;
  }

  handleCommand(message.command)
    .then(result => sendResponse(result))
    .catch(error => {
      console.error(error);

      sendResponse({
        success: false,
        message: error.message || "Something went wrong."
      });
    });

  return true;
});

async function handleCommand(command) {
  const text = command.trim();

  if (!text) {
    return {
      success: false,
      message: "No command was provided."
    };
  }

  const lower = text.toLowerCase();

  // -----------------------------
  // GOOGLE SEARCH
  // -----------------------------

  if (
    lower.startsWith("search google for ") ||
    lower.startsWith("search google ")
  ) {
    const searchText = text
      .replace(/^search google for /i, "")
      .replace(/^search google /i, "")
      .trim();

    if (!searchText) {
      return {
        success: false,
        message: "What should I search for?"
      };
    }

    const url =
      "https://www.google.com/search?q=" +
      encodeURIComponent(searchText);

    await chrome.tabs.create({
      url: url
    });

    return {
      success: true,
      message: `Opening Google and searching for "${searchText}".`
    };
  }

  // -----------------------------
  // YOUTUBE SEARCH
  // -----------------------------

  if (
    lower.startsWith("search youtube for ") ||
    lower.startsWith("search youtube ")
  ) {
    const searchText = text
      .replace(/^search youtube for /i, "")
      .replace(/^search youtube /i, "")
      .trim();

    if (!searchText) {
      return {
        success: false,
        message: "What should I search for on YouTube?"
      };
    }

    const url =
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(searchText);

    await chrome.tabs.create({
      url: url
    });

    return {
      success: true,
      message: `Opening YouTube and searching for "${searchText}".`
    };
  }

  // -----------------------------
  // OPEN WEBSITE
  // -----------------------------

  if (
    lower.startsWith("open ") ||
    lower.startsWith("go to ")
  ) {
    let site = text
      .replace(/^open /i, "")
      .replace(/^go to /i, "")
      .trim();

    if (!site) {
      return {
        success: false,
        message: "Which website should I open?"
      };
    }

    if (!site.startsWith("http://") && !site.startsWith("https://")) {
      site = "https://" + site;
    }

    await chrome.tabs.create({
      url: site
    });

    return {
      success: true,
      message: `Opening ${site}`
    };
  }

  // -----------------------------
  // CURRENT TAB
  // -----------------------------

  if (lower === "reload page" || lower === "refresh page") {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tabs.length) {
      return {
        success: false,
        message: "No active tab found."
      };
    }

    await chrome.tabs.reload(tabs[0].id);

    return {
      success: true,
      message: "Reloading the current page."
    };
  }

  // -----------------------------
  // UNKNOWN COMMAND
  // -----------------------------

  return {
    success: false,
    message:
      "I don't know how to do that yet. Try a Google search, YouTube search, opening a website, or refreshing the page."
  };
}
