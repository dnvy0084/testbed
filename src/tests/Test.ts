export default class Test {
  protected folder: dat.GUI | null = null;

  private caseContainer: HTMLDivElement | null = null;

  public start(gui: dat.GUI): void {
    this.folder = gui.addFolder(this.name);
    this.folder.open();
    this.testDidStart();
  }

  public dispose(gui: dat.GUI): void {
    this.testWillDispose();

    if (this.folder) {
      gui.removeFolder(this.folder);
    }

    if (this.caseContainer && this.caseContainer.parentElement) {
      this.caseContainer.parentElement.removeChild(this.caseContainer);
    }
  }

  protected testDidStart(): void {}

  protected testWillDispose(): void {}

  protected addAll(
    params: [Object, string, ...number[]][]
  ): (dat.GUIController | null)[] {
    return params.map(args => this.add(...args));
  }

  protected add(
    target: Object,
    propName: string,
    min?: number,
    max?: number,
    step?: number
  ): dat.GUIController | null {
    if (!this.folder) return null;

    return this.folder.add(target, propName, min, max, step);
  }

  protected layout(innerHTML: string, ...styles: string[]): void {
    const stage = document.querySelector("#stage");

    if (!stage) return;

    const div = document.createElement("div");
    const style = document.createElement("style");

    div.id = `${this.name}-case-container`;
    div.innerHTML = innerHTML;

    style.innerHTML = styles.join("\n");

    div.appendChild(style);
    stage.appendChild(div);

    this.caseContainer = div;
  }

  public get name(): string {
    return this.constructor.name;
  }
}
