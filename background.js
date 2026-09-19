```js
chrome.sidePanel.setPanelBehavior({
  openPanelOnActionClick: true
}).catch((error) => {
  console.error("Side panel error:", error);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "AI_COMMAND") {
    return;
  }

  handleCommand(message.command)
    .then(sendResponse)
    .catch((error) => {
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
      message: "Please enter a command."
    };
  }

  // OPEN YOUTUBE
  if (/^(open|go to)\s+youtube$/i.test(text)) {
    await chrome.tabs.create({
      url: "https://www.youtube.com/"
    });

    return {
      success: true,
      message: "Opening YouTube."
    };
  }

  // OPEN GOOGLE
  if (/^(open|go to)\s+google$/i.test(text)) {
    await chrome.tabs.create({
      url: "https://www.google.com/"
    });

    return {
      success: true,
      message: "Opening Google."
    };
  }

  // GOOGLE SEARCH
  const googleMatch = text.match(
    /^search\s+google(?:\s+for)?\s+(.+)$/i
  );

  if (googleMatch) {
    const search = googleMatch[1].trim();

    const url =
      "https://www.google.com/search?q=" +
      encodeURIComponent(search);

    await chrome.tabs.create({
      url: url
    });

    return {
      success: true,
      message: 'Searching Google for "' + search + '".'
    };
  }

  // YOUTUBE SEARCH
  const youtubeMatch = text.match(
    /^search\s+youtube(?:\s+for)?\s+(.+)$/i
  );

  if (youtubeMatch) {
    const search = youtubeMatch[1].trim();

    const url =
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(search);

    await chrome.tabs.create({
      url: url
    });

    return {
      success: true,
      message: 'Searching YouTube for "' + search + '".'
    };
  }

  // CLOSE WEBSITE / TAB
  const closeMatch = text.match(
    /^close\s+(.+)$/i
  );

  if (closeMatch) {
    const target = closeMatch[1].trim().toLowerCase();

    const tabs = await chrome.tabs.query({});

    // CLOSE CURRENT TAB
    if (target === "this tab" || target === "current tab") {
      const currentTabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!currentTabs.length) {
        return {
          success: false,
          message: "No active tab found."
        };
      }

      await chrome.tabs.remove(currentTabs[0].id);

      return {
        success: true,
        message: "Closed the current tab."
      };
    }

    // FIND MATCHING TAB
    const matchingTab = tabs.find((tab) => {
      const title = (tab.title || "").toLowerCase();
      const url = (tab.url || "").toLowerCase();

      return (
        title.includes(target) ||
        url.includes(target)
      );
    });

    if (!matchingTab) {
      return {
        success: false,
        message: 'I could not find a tab for "' + closeMatch[1].trim() + '".'
      };
    }

    await chrome.tabs.remove(matchingTab.id);

    return {
      success: true,
      message: "Closed " + closeMatch[1].trim() + "."
    };
  }

  // OPEN WEBSITE
  const openMatch = text.match(
    /^(?:open|go to)\s+(.+)$/i
  );

  if (openMatch) {
    let site = openMatch[1].trim();

    if (
      !site.startsWith("http://") &&
      !site.startsWith("https://")
    ) {
      site = "https://" + site;
    }

    await chrome.tabs.create({
      url: site
    });

    return {
      success: true,
      message: "Opening " + site
    };
  }

  // REFRESH CURRENT PAGE
  if (
    /^refresh page$/i.test(text) ||
    /^reload page$/i.test(text)
  ) {
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
      message: "Refreshing the current page."
    };
  }

  return {
    success: false,
    message: 'I do not know how to perform "' + text + '" yet.'
  };
}
```
