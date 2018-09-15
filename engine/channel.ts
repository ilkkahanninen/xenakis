import { printPattern } from "./ui";
import { shallowCopy } from "./utils";

type ChannelType = "drum" | "melody";

export interface Note {
  note: number;
  velocity: number;
}

export interface Listenable {
  addListener: (listener: ChannelEventListener) => void;
  triggerEvent: (type: ChannelEventType) => void;
}

export interface Channel extends Listenable {
  type: ChannelType;
  name: string;
  midiChannel: number;
  pattern: Note[];
  position: number;
  repeats: number;
  legato: boolean;
  transpose: number;
  scale?: number[];
  playingNote?: Note
}

export interface Play {
  note: Note;
  midiChannel: number;
}

export type ChannelEventType = "startLoop";

export type ChannelEventListener = (
  type: ChannelEventType,
  channel: Channel
) => void;

const withEventSupport = <T extends object>(obj: T): T & Listenable => {
  const listeners: ChannelEventListener[] = [];
  console.log(obj)
  return Object.assign({}, obj, {
    addListener(listener) {
      listeners.push(listener);
    },
    triggerEvent(type) {
      listeners.forEach(listener => listener(type, this));
    }
  });
};

export const createDrumChannel = (opts: {
  name: string;
  midiChannel: number;
  note: number;
  length: number;
  options?: {};
}): Channel =>
  withEventSupport({
    type: "drum" as ChannelType,
    name: opts.name,
    midiChannel: opts.midiChannel,
    pattern: Array(opts.length)
      .fill({
        note: opts.note,
        velocity: 0
      })
      .map(shallowCopy),
    position: -1,
    repeats: 0,
    legato: false,
    transpose: 0,
    ...opts.options
  });

export const createMelodyChannel = (opts: {
  name: string;
  midiChannel: number;
  length: number;
  options?: {};
}): Channel =>
  withEventSupport({
    type: "melody" as ChannelType,
    name: opts.name,
    midiChannel: opts.midiChannel,
    pattern: Array(opts.length)
      .fill({
        note: 0,
        velocity: 0
      })
      .map(shallowCopy),
    position: -1,
    repeats: 0,
    legato: true,
    transpose: 0,
    ...opts.options
  });

export const updateChannelPosition = (
  channel: Channel,
  timeElapsed: number,
  ticksPerMinute: number
): Play | null => {
  const tickLength = 60000 / ticksPerMinute;
  const newPosition =
    Math.floor(timeElapsed / tickLength) % channel.pattern.length;
    
  if (channel.position !== newPosition) {
    channel.position = newPosition;

    if (newPosition === 0) {
      channel.triggerEvent("startLoop");
      channel.repeats++;
    }

    return {
      note: channel.pattern[newPosition],
      midiChannel: channel.midiChannel
    };
  }
  return null;
};
