(function applySavedSettings() {
  const hostname = location.hostname;
  console.log("hostname", hostname);

  chrome.storage.local.get(
    [`brightness_${hostname}`, `volume_${hostname}`],
    (result) => {
      const savedBrightness = result[`brightness_${hostname}`];
      const savedVolume = result[`volume_${hostname}`];

      if (savedBrightness !== undefined) {
        document.documentElement.style.filter = `brightness(${savedBrightness})`;
      }

      if (savedVolume !== undefined) {
        const mediaElements = document.querySelectorAll("audio, video");
        mediaElements.forEach((element) => {
          element.volume = savedVolume;
        });
      }
    },
  );
})();
