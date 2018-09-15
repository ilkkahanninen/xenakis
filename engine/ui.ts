import * as colors from "colors/safe";
import * as cliCursor from "cli-cursor";
import { Channel, Note } from "./channel";
import { Instrument } from "./instrument";

const velocitySymbols = [
  "\u2581",
  "\u2582",
  "\u2583",
  "\u2584",
  "\u2585",
  "\u2586",
  "\u2587",
  "\u2588"
];

cliCursor.hide();

export const write = (str: string) => process.stdout.write(str);

export const clearScreen = () => write("\x1B[2J\x1B[0f");

export const setPos = (line: number, col: number) =>
  write(`\x1B[${line};${col}H`);

// Patterns
const patternStep = (data: string[], from: number, to?: number) =>
  data
    .slice(from, to)
    .map(x => x.padEnd(3, " "))
    .join("");

export const printPattern = (name: string, data: string[], pos: number) =>
  console.log(
    "  " +
      colors.green(name.padEnd(12, " ")) +
      colors.white(" [") +
      colors.gray(patternStep(data, 0, pos)) +
      colors.white(patternStep(data, pos, pos + 1)) +
      colors.gray(patternStep(data, pos + 1)) +
      colors.white("]")
  );

export const printChannel = (channel: Channel) =>
  printPattern(
    channel.name,
    channel.type === "drum"
      ? channel.pattern.map(note => velocitySymbol(note))
      : channel.pattern.map(note => noteSymbol(note)),
    channel.position
  );

export const printInstrument = (instrument: Instrument) => {
  console.log(colors.yellow(instrument.name) + "\n");
  instrument.channels.forEach(printChannel);
  console.log();
};

export const velocitySymbol = (note: Note) =>
  note.velocity > 0
    ? velocitySymbols[
        Math.floor((note.velocity * velocitySymbols.length) / 127)
      ]
    : ".";

export const noteSymbol = (note: Note) =>
  note.velocity > 0 ? `${note.note}` : ".";

export const printTitle = (title: string) => console.log(colors.red(title) + "\n");
