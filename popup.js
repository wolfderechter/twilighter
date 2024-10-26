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
      // TODO: what should we dim?
      // a) the whole screen
      const rootElement = document.documentElement;
      if (rootElement)
        rootElement.style.filter = `brightness(${brightness / 100})`;

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
const volumeSlider = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");
volumeValue.textContent = volumeSlider.value;

volumeSlider.addEventListener("input", updateVolume);

async function updateVolume(event) {
  const volume = event.target.value;
  volumeValue.textContent = volume;

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [volume], // pass volume to the function
    func: (volume) => {
      const mediaElements = document.querySelectorAll("audio, video");
      mediaElements.forEach((element) => {
        element.volume = volume / 100;
        console.log(element, volume);
      });
    },
  });
}
