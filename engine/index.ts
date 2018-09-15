import { Instrument, updateInstrumentPosition } from "./instrument";
import { timeNow } from "./utils";
import { Play } from "./channel";
import { clearScreen, printInstrument, printTitle, setPos } from "./ui";
import { sendIntrumentMidiEvents, getPortName } from "./midi";

export const run = (name: string, instruments: Instrument[]) => {
  const startTime = timeNow();
  const ticksPerMinute = 120 * 4;
  const title = `${name} (${getPortName()})`;

  const render = () => {
    try {
      const elapsedTime = timeNow() - startTime;
      const plays: Play[] = [];
      Object.values(instruments).forEach(instrument =>
        plays.push(
          ...updateInstrumentPosition(instrument, elapsedTime, ticksPerMinute)
        )
      );

      if (plays.length > 0) {
        setPos(0, 0);
        printTitle(title);
        Object.values(instruments).forEach(printInstrument);
        Object.values(instruments).forEach(sendIntrumentMidiEvents);
      }
      setTimeout(render, 0);
    } catch (err) {
      console.log("Something bad happened\n");
      console.log(instruments);
      throw err;
    }
  };

  clearScreen();
  render();
};
