import { Channel, createDrumChannel, updateChannelPosition, createMelodyChannel } from "./channel";

export interface Instrument {
  name: string;
  channels: Channel[];
}

export const createDrumMachine = (opts: {
  name: string;
  midiChannel: number;
  length: number;
  channels: Array<{
    name: string;
    note: number;
  }>;
  options?: {};
}): Instrument => ({
  name: opts.name,
  channels: opts.channels.map(channel =>
    createDrumChannel({
      name: channel.name,
      midiChannel: opts.midiChannel,
      note: channel.note,
      length: opts.length,
      options: opts.options
    })
  )
});

export const createSynth = (opts: {
  name: string;
  midiChannel: number;
  length: number;
  polyphony: number;
  options?: {}
}): Instrument => ({
  name: opts.name,
  channels: Array(opts.polyphony)
    .fill(null)
    .map((_x, index) =>
      createMelodyChannel({
        name: `#${index}`,
        midiChannel: opts.midiChannel,
        length: opts.length,
        options: opts.options
      })
    )
});

export const updateInstrumentPosition = (
  instrument: Instrument,
  timeElapsed: number,
  ticksPerMinute: number
) =>
  instrument.channels
    .map(channel => updateChannelPosition(channel, timeElapsed, ticksPerMinute))
    .filter(a => a);
