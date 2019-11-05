import Test from "./Test";

export default class TestA extends Test {
  protected testDidStart(): void {
    console.log("started", this.name);
  }

  protected testWillDispose(): void {
    console.log("dispose", this.name);
  }
}
