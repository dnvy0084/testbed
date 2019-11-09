import TestBase from "./tests/TestBase";
import WebGLBase from "./tests/webgl/WebGLBase";
import FragCoordTest from "./tests/webgl/FragCoordTest";

export interface TestDef {
  new (): TestBase;
}

export default {
  WebGLBase,
  FragCoordTest
};
