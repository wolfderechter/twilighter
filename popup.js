const brightnessSlider = document.getElementById("brightness");
const brightnessValue = document.getElementById("brightnessValue");
const volumeSlider = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");

document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const hostname = new URL(tab.url).hostname;

  // Load the saved brightness and volume values for this tab
  chrome.storage.local.get(
    [`brightness_${hostname}`, `volume_${hostname}`],
    (result) => {
      const savedBrightness = result[`brightness_${hostname}`];
      const savedVolume = result[`volume_${hostname}`];

      // Set brightness slider and value
      if (savedBrightness !== undefined) {
        brightnessSlider.value = savedBrightness * 100; // Convert to percentage for the slider
        brightnessValue.textContent = brightnessSlider.value;
        updateBrightness(savedBrightness);
      } else {
        brightnessValue.textContent = brightnessSlider.value; // use the default slider value if no savedBrightness found
      }
      // Set volume slider and value
      if (savedVolume !== undefined) {
        volumeSlider.value = savedVolume * 100; // Convert to percentage for the slider
        volumeValue.textContent = volumeSlider.value;
        updateVolume(savedVolume);
      } else {
        volumeValue.textContent = volumeSlider.value; // use the default slider value if no savedVolume found
      }
    },
  );
});

brightnessSlider.addEventListener("input", async (event) => {
  const brightness = event.target.value / 100;
  brightnessValue.textContent = event.target.value;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const hostname = new URL(tab.url).hostname;

  // Save the volume value for this tab in localstorage
  chrome.storage.local.set({ [`brightness_${hostname}`]: brightness });

  updateBrightness(brightness);
});

volumeSlider.addEventListener("input", async (event) => {
  const volume = event.target.value / 100;
  volumeValue.textContent = event.target.value;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const hostname = new URL(tab.url).hostname;

  // Save the volume value for this tab in localstorage
  chrome.storage.local.set({ [`volume_${hostname}`]: volume });

  updateVolume(volume);
});

/**
 * Function to update the brightness of a specific tab
 * @param brightness - the brightness value for the whole tab
 */
async function updateBrightness(brightness) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Skip if the tab is a chrome:// or file:// URL - since they are not accessible for security reasons
  if (tab.url.startsWith("chrome://") || tab.url.startsWith("file://")) return;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [brightness], // pass brightness to the function
    func: (brightness) => {
      // TODO: what should we dim?
      // a) the whole screen
      const rootElement = document.documentElement;
      if (rootElement) rootElement.style.filter = `brightness(${brightness})`;

      // b) all the 'video' elements on a page
      // const mediaElements = document.querySelectorAll("video");
      // mediaElements.forEach(element => {
      //   element.style.filter = `brightness(${brightness / 100})`;
      // });

      // c) the teams screenshare element
      // const screenShare = document.querySelector(
      //   '[data-type="screen-sharing"]',
      // );
      // if (screenShare) {
      //   screenShare.style.filter = `brightness(${brightness / 100})`;
      // }
    },
  });
}

/**
 * Function to update the volume for all audio and video elements inside a tab
 * @param volume - the volume value for the audio and video elements on a page
 */
async function updateVolume(volume) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Skip if the tab is a chrome:// or file:// URL - since they are not accessible for security reasons
  if (tab.url.startsWith("chrome://") || tab.url.startsWith("file://")) return;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [volume], // pass volume to the function
    func: (volume) => {
      const mediaElements = document.querySelectorAll("audio, video");
      mediaElements.forEach((element) => {
        element.volume = volume;
      });
    },
  });
}
