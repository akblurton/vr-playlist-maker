export async function getAudioDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices({
      audio: true,
      video: false,
    });
    return devices.filter(({ kind }) => kind === "audiooutput");
  } catch (e) {
    return [];
  }
}

export async function buildAudioElements(sounds, device) {
  return await Promise.all(sounds.map(async function(item) {
    if (!item) {
      return null;
    }
    const { sound, volume = 100 } = item;
    const audio = document.createElement("audio");
    if (device) {
      console.log("Setting audio device", device);
      await audio.setSinkId(device);
      console.log("Audio device attached to", device);
    }
    audio.setAttribute("src", sound);
    audio.volume = volume / 100;
    return audio;
  }));
}
