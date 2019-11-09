import WebGLBase from "./WebGLBase";
import {
  createProgram,
  createArrayBuffer,
  createElementArrayBuffer
} from "./glu/glu";
import { addRadioGroupOnGUI } from "../../utils/datgui";

const fragmentSource = `
  precision mediump float;

  uniform vec2 resolution;
  uniform float time;

  void main() {
    vec2 normalized = gl_FragCoord.xy / resolution;

    float f = cos((time / 300.0 + 1.0) / 2.0);

    gl_FragColor = vec4(normalized.yx, f, 1.0);
  }
`;

const fragmentSourceForMouse = `
  precision mediump float;

  uniform vec2 resolution;
  uniform float time;

  void main() {
    vec2 st = gl_FragCoord.xy / resolution;

    gl_FragColor = vec4(st, time, 1.0);
  }
`;

export default class FragCoordTest extends WebGLBase {
  private vertexBuf: WebGLBuffer;
  private indexBuf: WebGLBuffer;
  private pos: number;
  private id: number = 0;

  private programForTime: WebGLProgram;
  private programForMouse: WebGLProgram;

  protected testDidStart(): void {
    this.initGL();
    this.programForTime = createProgram(
      this.gl,
      this.basicVertexSource,
      fragmentSource
    );

    this.programForMouse = createProgram(
      this.gl,
      this.basicVertexSource,
      fragmentSourceForMouse
    );

    this.vertexBuf = createArrayBuffer(
      this.gl,
      new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1])
    );
    this.indexBuf = createElementArrayBuffer(
      this.gl,
      new Uint16Array([0, 1, 2, 0, 2, 3])
    );

    addRadioGroupOnGUI(
      this.folder as dat.GUI,
      ["time", "mouse"],
      this.onModeChanged,
      "time"
    );
  }

  private onModeChanged = (key: string): void => {
    console.log(key);
    this.testWillDispose();

    switch (key) {
      case "time":
        this.program = this.programForTime;
        break;

      case "mouse":
        this.program = this.programForMouse;
        break;
    }

    this.gl.useProgram(this.program);

    const resolution = this.gl.getUniformLocation(this.program, "resolution");

    this.gl.uniform2f(resolution, this.canvas.width, this.canvas.height);
    this.pos = this.gl.getAttribLocation(this.program, "pos");
    this.gl.enableVertexAttribArray(this.pos);

    switch (key) {
      case "time":
        this.id = this.render(0);
        break;

      case "mouse":
        this.canvas.addEventListener("mousemove", this.onMouseMove);
        break;
    }
  };
  private index = 0;
  private onMouseMove = (e: MouseEvent): void => {
    const f = e.offsetX / this.canvas.width;

    this.draw(f);

    console.log(e.type, f);
  };

  protected testWillDispose(): void {
    cancelAnimationFrame(this.id);
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
  }

  private render = (ms: number): number => {
    console.log("render");
    this.draw(ms);

    return (this.id = requestAnimationFrame(this.render));
  };

  private draw(f: number): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const time = this.gl.getUniformLocation(this.program, "time");

    this.gl.uniform1f(time, f);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuf);
    this.gl.vertexAttribPointer(this.pos, 4, this.gl.FLOAT, false, 2 * 4, 0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
  }
}
