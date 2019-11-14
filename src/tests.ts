import TestBase from "./tests/TestBase";
import WebGLBase from "./tests/webgl/WebGLBase";
import FragCoordTest from "./tests/webgl/FragCoordTest";
import ReduxBasicTest from "./tests/react/ReduxBasicTest";
import ReactReduxTest from "./tests/react/ReactReduxTest";
import LinearFunctionTest from "./tests/webgl/LinearFunctionTest";
import FragTemplate from "./tests/webgl/FragTemplate";

export interface TestDef {
  new (): TestBase;
}

export default {
  WebGLBase,
  FragCoordTest,
  ReduxBasicTest,
  ReactReduxTest,
  LinearFunctionTest,
  FragTemplate
};
