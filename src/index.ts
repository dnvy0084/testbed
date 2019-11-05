import dat from "dat.gui";
import { parseQueryParam } from "./utils/string";
import { addRadioGroupOnGUI } from "./utils/datgui";
import tests, { TestDef } from "./tests";
import Test from "./tests/Test";

function onTestChange(
  testlist: Record<string, TestDef>,
  gui: dat.GUI
): (key: string) => void {
  let testcase: Test | null = null;

  return function(key: string): void {
    if (testcase) {
      testcase.dispose(gui);
    }

    testcase = new testlist[key]();
    testcase.start(gui);
  };
}

function onLoaded(): void {
  const url = new URL(document.location.href);
  const param = parseQueryParam(url.search);
  const gui = new dat.GUI();

  addRadioGroupOnGUI(
    gui.addFolder("Tests"),
    Object.keys(tests),
    onTestChange(tests, gui),
    param.case
  );
}

window.addEventListener("load", onLoaded);
window.addEventListener("changetest", () => console.log());
