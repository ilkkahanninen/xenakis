import * as MIDI from "midi";
import { Channel } from "./channel";
import { Instrument } from "./instrument";

let output;
let portName = "MIDI disabled";

// MIDI setup and tear down

const exitHandler = () => {
  if (output) {
    for (let i = 0; i < 16; i++) {
      sendMessage([0xb0 + i, 120, 0]);
    }
    output.closePort();
  }
  process.exit();
};

try {
  output = new MIDI.output();
  output.openPort(0);
  portName = output.getPortName(0);
  process.on("SIGINT", exitHandler);
} catch (err) {
  console.log("Running in silent mode");
  output = null;
}

// API

export const getPortName = () => portName;

export const sendMessage = (message: number[]) =>
  output && output.sendMessage(message);

export const sendKeyDown = (channel: number, note: number, velocity: number) =>
  sendMessage([0x90 + channel, note, velocity]);

export const sendKeyUp = (channel: number, note: number, velocity: number) =>
  sendMessage([0x80 + channel, note, velocity]);

export const sendChannelMidiEvents = (channel: Channel) => {
  const nextNote = channel.pattern[channel.position];
  const prevNote =
    channel.position > 0
      ? channel.pattern[channel.position - 1]
      : channel.pattern[channel.pattern.length - 1];

  if (
    nextNote.velocity > 0 &&
    prevNote.velocity > 0 &&
    prevNote.note === nextNote.note
  ) {
    if (!channel.legato) {
      sendKeyUp(channel.midiChannel, prevNote.note, prevNote.velocity);
      sendKeyDown(channel.midiChannel, nextNote.note, nextNote.velocity);
    }
  } else {
    if (prevNote.velocity > 0) {
      sendKeyUp(channel.midiChannel, prevNote.note, prevNote.velocity);
    }
    if (nextNote.velocity > 0) {
      sendKeyDown(channel.midiChannel, nextNote.note, nextNote.velocity);
    }
  }
};

export const sendIntrumentMidiEvents = (instrument: Instrument) =>
  instrument.channels.forEach(sendChannelMidiEvents);
