import TestBase from "../TestBase";
import {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  MiddlewareAPI,
  Dispatch,
  AnyAction
} from "redux";

interface State {
  a: number;
  b: boolean;
  c: string;
}

interface Action {
  type: string;
  payload: any;
}

const initialState: State = {
  a: 0,
  b: true,
  c: "hello, world!"
};

function a(state: number = 0, action: Action): number {
  const { type, payload } = action;

  switch (type) {
    case "A":
      return payload;

    default:
  }

  return state;
}

function b(state: boolean = false, action: Action): boolean {
  const { type, payload } = action;

  switch (type) {
    case "B":
      return payload;

    default:
  }

  return state;
}

function c(state: string = "default", action: Action): string {
  const { type, payload } = action;

  switch (type) {
    case "C":
      return payload;

    default:
  }

  return state;
}

function reducer(state: State = initialState, action: Action): State {
  const { type, payload } = action;

  switch (type) {
    case "A":
      return {
        ...state,
        a: payload
      };

    case "B":
      return {
        ...state,
        b: payload
      };

    case "C":
      return {
        ...state,
        c: payload
      };

    default:
  }

  return state;
}

function delay(ms: number): Promise<void> {
  return new Promise(function(resolve): void {
    setTimeout(resolve, ms);
  });
}

function asyncDispatch({
  getState
}: MiddlewareAPI): (next: Dispatch) => (action: AnyAction) => AnyAction {
  return function(next: Dispatch): any {
    return async function(action: Action): Promise<any> {
      console.log("will dispatch", action);

      await delay(500);
      const result = next(action);

      console.log("state after dispath", getState());

      return result;
    };
  };
}

function minUntil(n: number): any {
  return function({ getState }: MiddlewareAPI) {
    return function(next: Dispatch) {
      return function(action: Action) {
        if (action.type !== "A") return action;

        const copy = { ...action };

        if (copy.payload > n) copy.payload = 0;

        return next(copy);
      };
    };
  };
}

const reducers = { a, b, c };
const store = createStore(
  combineReducers(reducers),
  applyMiddleware(asyncDispatch, minUntil(5))
);

const bounded = bindActionCreators(
  {
    increment(n: number): Action {
      return { type: "A", payload: n };
    },
    toggle(b: boolean): Action {
      return { type: "B", payload: b };
    },
    decrement(str: string): Action {
      return { type: "C", payload: str };
    }
  },
  store.dispatch
);

console.log(bounded);

export default class ReduxBasicTest extends TestBase {
  public a: number = 0;
  public b: boolean = true;
  public c: string = "hello";

  protected testDidStart(): void {
    store.subscribe(this.onRender);

    if (!this.folder) return;

    this.addAll([
      [this, "a"],
      [this, "b"],
      [this, "c"],
      [this, "increment"],
      [this, "toggle"],
      [this, "decrement"]
    ]);
  }

  private action(
    type: "A" | "B" | "C",
    payload: number | boolean | string
  ): Action {
    return { type, payload };
  }

  private increment(): void {
    // store.dispatch(this.action("A", this.a + 1));
    bounded.increment(this.a + 1);
  }

  private toggle(): void {
    store.dispatch(this.action("B", !this.b));
  }

  private decrement(): void {
    // store.dispatch(this.action("C", this.c.slice(0, -1)));
    bounded.decrement(this.c.slice(0, -1) || "hello");
  }

  private onRender = (): void => {
    console.log(">>:", store.getState());

    const { a, b, c } = store.getState();

    this.a = a;
    this.b = b;
    this.c = c;

    if (this.folder) this.folder.updateDisplay();
  };
}
