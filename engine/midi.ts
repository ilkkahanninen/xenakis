import * as MIDI from "midi";
import * as readline from "readline-sync";
import { Channel, Note } from "./channel";
import { Instrument } from "./instrument";

let output;
let portName = "MIDI disabled";

// MIDI setup and tear down

export const killAudio = () => {
  if (output) {
    for (let i = 0; i < 16; i++) {
      sendMessage([0xb0 + i, 120, 0]);
    }
    output.closePort();
  }
}

const exitHandler = () => {
  killAudio();
  process.exit();
};

try {
  output = new MIDI.output();
  const portCount = output.getPortCount();
  if (portCount > 0) {
    let port = 0;
    if (portCount > 1) {
      for (let i = 0; i < portCount; i++) {
        console.log(`${i + 1}) ${output.getPortName(i)}`);
      }
      port = parseInt(readline.question("Select port"), 10) - 1;
    }
    output.openPort(port);
    portName = output.getPortName(port);
    process.on("SIGINT", exitHandler);  
  }
} catch (err) {
  console.log("Running in silent mode");
  output = null;
}

// API

export const getPortName = () => portName;

export const sendMessage = (message: number[]) =>
  output && output.sendMessage(message);

export const sendKeyDown = (channel: number, note: number, velocity: number) =>
  note < 128 && channel < 16 && velocity < 128 && sendMessage([0x90 + channel, note, velocity]);

export const sendKeyUp = (channel: number, note: number, velocity: number) =>
  sendMessage([0x80 + channel, note, velocity]);

export const scaledNote = (note: Note, scale?: number[]): Note =>
  scale && scale.length > 0 ? {
    ...note,
    note: scale[note.note % scale.length] + Math.floor(note.note / scale.length) * 12
  } : note;

export const sendChannelMidiEvents = (channel: Channel) => {
  const nextNote = scaledNote(channel.pattern[channel.position], channel.scale);

  const stopNote = () => {
    sendMessage([0xb0 + channel.midiChannel - 1, 120, 0]);
    channel.playingNote = undefined;
  }

  const playNote = () => {
    if (channel.playingNote) {
      stopNote();
    }
    sendKeyDown(channel.midiChannel - 1, nextNote.note + channel.transpose, nextNote.velocity); 
    channel.playingNote = nextNote;
  }

  if (channel.playingNote && nextNote.velocity > 0 && channel.playingNote.note === nextNote.note) {
    if (!channel.legato) {
      playNote();
    }
  } else if (nextNote.velocity > 0) {
    playNote();
  } else {
    stopNote();
  }
};

export const sendIntrumentMidiEvents = (instrument: Instrument) =>
  instrument.channels.forEach(sendChannelMidiEvents);
