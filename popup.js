const brightnessSlider = document.getElementById("brightness");
const brightnessValue = document.getElementById("brightnessValue");
brightnessValue.textContent = brightnessSlider.value;

brightnessSlider.addEventListener("input", updateBrightness);

async function updateBrightness(event) {
  const brightness = event.target.value;
  brightnessValue.textContent = brightness;

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [brightness], // pass brightness to the function
    func: (brightness) => {
      const screenShare = document.querySelector(
        '[data-type="screen-sharing"]',
      );

      if (screenShare) {
        screenShare.style.filter = `brightness(${brightness / 100})`;
      }
    },
  });
}
