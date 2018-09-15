import { ChannelEventListener } from "../engine/channel";
import { run } from "../engine";
import { createDefaultDevices } from "../device-config";
import { runRandomly } from "../engine/utils";
import {
  replacingPointMutation,
  adjustingPointMutation,
  silentingPointMutation
} from "../engine/mutations";

const mutateChannelOnLoopStart: ChannelEventListener = (type, channel) => {
  if (type === "startLoop") {
    runRandomly([
      () => replacingPointMutation(channel),
      () => adjustingPointMutation(channel),
      () => silentingPointMutation(channel)
    ]);
  }
};

const instruments = createDefaultDevices();

instruments.vermona.channels.forEach(channel => {
  channel.addListener(mutateChannelOnLoopStart);
});

instruments.microbrute.channels.forEach(channel => {
  channel.addListener(mutateChannelOnLoopStart);
});

run("Proof of concept", Object.values(instruments));
