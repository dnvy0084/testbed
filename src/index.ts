import dat from "dat.gui";
import { parseQueryParam } from "./utils/string";
import { addRadioGroupOnGUI } from "./utils/datgui";
import tests, { TestDef } from "./tests";
import Test from "./tests/TestBase";

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
  const labels = Object.keys(tests);

  const folder = addRadioGroupOnGUI(
    gui.addFolder("Tests"),
    labels,
    onTestChange(tests, gui),
    param.case
  );

  if (!param.case) {
    folder.open();
  } else {
    const include = labels
      .map(label => label.toLocaleLowerCase())
      .includes(param.case.toLowerCase());

    if (!include) folder.open();
  }
}

window.addEventListener("load", onLoaded);
