console.log("🤖 Browser AI YouTube controller loaded.");

function findFirstVideo() {
  const video = document.querySelector(
    "ytd-video-renderer a#video-title"
  );

  if (!video) {
    return false;
  }

  console.log("🎬 Found first YouTube result!");

  video.click();

  return true;
}

function waitForVideo() {
  let attempts = 0;

  const timer = setInterval(() => {
    attempts++;

    if (findFirstVideo()) {
      clearInterval(timer);
      return;
    }

    if (attempts >= 30) {
      clearInterval(timer);
      console.log("❌ Couldn't find a YouTube result.");
    }
  }, 1000);
}

if (location.pathname === "/results") {
  waitForVideo();
}
