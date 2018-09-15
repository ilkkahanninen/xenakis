import { ChannelEventListener, Channel } from "../engine/channel";
import { run } from "../engine";
import { createDefaultDevices } from "../device-config";
import { runRandomly, randomInt } from "../engine/utils";
import {
  replacingPointMutation,
  adjustingPointMutation,
  silentingPointMutation
} from "../engine/mutations";

const mutateChannelOnLoopStart: ChannelEventListener = (type, channel) => {
  if (type === "startLoop") {
    const activeNotes = channel.pattern.reduce((sum, note) => sum + (note.velocity > 0 ? 1 : 0), 0);
    if (activeNotes / channel.pattern.length > 0.33) {
      silentingPointMutation(channel);
    }
    if (channel.repeats % 4 === 0) {
      for (let i = 0; i < 4; i++) {
        runRandomly([
          () => replacingPointMutation(channel),
          () => adjustingPointMutation(channel),
        ]);
      }
    }
  }
};

const generateArpeggio = (channel: Channel) => {
  const arp = Array(randomInt(2, 6)).fill(0).map(() => randomInt(0, 10));
  channel.pattern.forEach((note, index) => {
    note.note = arp[index % arp.length];
    note.velocity = 100;
  });
};

const mutateArpeggio = (majorOffset: number): ChannelEventListener => (type, channel) => {
  if (type === "startLoop") {
    if (channel.repeats % 16 === majorOffset) {
      runRandomly([
        () => generateArpeggio(channel),
        () => channel.pattern.forEach((note, index) => {
          if (index % 2 === 1) {
            note.velocity = 0;
          }
        }),
      ]);
    }
    runRandomly([
      () => replacingPointMutation(channel),
      () => adjustingPointMutation(channel),
    ]);
  }
};

const scale = [0, 2, 5, 6, 7, 9];

const instruments = createDefaultDevices();

instruments.vermona.channels.forEach(channel => {
  channel.addListener(mutateChannelOnLoopStart);
});

instruments.microbrute.channels.forEach(channel => {
  channel.addListener(mutateArpeggio(0));
  // channel.transpose = 12;
  channel.scale = scale;
  generateArpeggio(channel);
});

instruments.system1.channels.forEach((channel, index) => {
  if (index === 0) {
    channel.addListener(mutateArpeggio(8));
    generateArpeggio(channel);
  }
  channel.scale = scale;
});

// console.log(JSON.stringify(instruments, null, 2))

run("Proof of concept", Object.values(instruments));
