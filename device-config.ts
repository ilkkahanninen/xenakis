import { createDrumMachine, createSynth } from "./engine/instrument";

export const createVermonaDRM1 = () =>
  createDrumMachine({
    name: "Vermona DRM1",
    midiChannel: 10,
    channels: [
      { name: "Kick", note: 0 },
      { name: "Drum 1", note: 1 },
      { name: "Drum 2", note: 2 },
      { name: "Multi", note: 3 },
      { name: "Snare", note: 4 },
      { name: "Clap", note: 5 },
      { name: "HH1 clsd", note: 8 },
      { name: "HH1 open", note: 10 },
      { name: "HH2 clsd", note: 12 },
      { name: "HH2 open", note: 14 }
    ],
    length: 16
  });

export const createMicrobrute = () =>
  createSynth({
    name: "Arturia Microbrute",
    midiChannel: 1,
    polyphony: 1,
    length: 16
  });

export const createSystem1 = () =>
  createSynth({
    name: "Roland System-1",
    midiChannel: 2,
    polyphony: 4,
    length: 16
  });

export const createDefaultDevices = () => ({
  vermona: createVermonaDRM1(),
  microbrute: createMicrobrute(),
  system1: createSystem1()
});
