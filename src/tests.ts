import TestA from "./tests/TestA";
import TestB from "./tests/TestB";
import Test from "./tests/Test";

export interface TestDef {
  new (): Test;
}

export default {
  TestA,
  TestB
};
