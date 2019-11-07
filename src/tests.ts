import TestA from "./tests/TestA";
import TestB from "./tests/TestB";
import TestBase from "./tests/TestBase";
import WebGLBase from "./tests/webgl/WebGLBase";

export interface TestDef {
  new (): TestBase;
}

export default {
  TestA,
  TestB,
  WebGLBase
};
