import TestBase from "./TestBase";

export default class TestA extends TestBase {
  protected testDidStart(): void {
    console.log("started", this.name);
  }

  protected testWillDispose(): void {
    console.log("dispose", this.name);
  }
}
