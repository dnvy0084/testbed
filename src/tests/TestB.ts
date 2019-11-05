import Test from "./Test";
import { addRadioGroupOnGUI } from "../utils/datgui";

const html = `
  <div class="wrapper"></div>
`;

const style = `
  .wrapper {
    background-color: black;
    height: 100px;
  }
`;

export default class TestB extends Test {
  public a: string = "property a";
  public b: boolean = true;
  public c: number = 5;

  protected testDidStart(): void {
    if (!this.folder) return;

    this.addAll([[this, "a"], [this, "b"], [this, "c", 0, 10]]);

    addRadioGroupOnGUI(
      this.folder.addFolder("radiogroup test"),
      ["a", "b", "c"],
      this.onChange
    );

    this.layout(html, style);
  }

  protected onChange = (key: string) => {
    console.log("change", key);
  };
}
