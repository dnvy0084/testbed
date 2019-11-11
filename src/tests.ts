import TestBase from "./tests/TestBase";
import WebGLBase from "./tests/webgl/WebGLBase";
import FragCoordTest from "./tests/webgl/FragCoordTest";
import ReduxBasicTest from "./tests/react/ReduxBasicTest";

export interface TestDef {
  new (): TestBase;
}

export default {
  WebGLBase,
  FragCoordTest,
  ReduxBasicTest
};
