import { Channel } from "./channel";
import { randomIndex, randomInt, clamp, pickRandom } from "./utils";

export const replacingPointMutation = (
  channel: Channel,
  options: {
    minNote?: number;
    maxNote?: number;
    minVelocity?: number;
    maxVelocity?: number;
  } = {}
) => {
  const pos = randomIndex(channel.pattern);
  channel.pattern[pos].velocity = randomInt(
    options.minVelocity || 0,
    options.maxVelocity || 127
  );
  if (channel.type === "melody") {
    channel.pattern[pos].note = randomInt(
      options.minNote || 0,
      options.maxNote || 12
    );
  }
};

export const adjustingPointMutation = (
  channel: Channel,
  options: {
    minNote?: number;
    maxNote?: number;
    minVelocity?: number;
    maxVelocity?: number;
  } = {}
) => {
  const pos = randomIndex(channel.pattern);
  if (channel.pattern[pos].velocity === 0) {
    channel.pattern[pos].velocity = clamp(
      0,
      channel.pattern[pos].velocity +
        randomInt(options.minVelocity || -32, options.maxVelocity || 32),
      127
    );
  }
  if (channel.type === "melody") {
    channel.pattern[pos].note = clamp(
      0,
      channel.pattern[pos].note +
        randomInt(options.minNote || -3, options.maxNote || 3),
      127
    );
  }
};

export const silentingPointMutation = (channel: Channel) => {
  const activeNoteIndices = channel.pattern
    .map((note, index) => (note.velocity > 0 ? index : null))
    .filter(index => index !== null);
  if (activeNoteIndices.length > 0) {
    const pos = pickRandom(activeNoteIndices);
    channel.pattern[pos].velocity = 0;
  }
};
