import TestBase from "../TestBase";
import { createProgram } from "./glu/glu";

const vertexSource = `
attribute vec2 pos;

void main() {
  gl_Position = vec4(pos, 0.0, 1.0);
}
`;

const fragmentSource = `
precision mediump float;

void main() {
  gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
}
`;

export default class WebGLBase extends TestBase {
  protected canvas: HTMLCanvasElement;
  protected gl: WebGLRenderingContext;
  protected program: WebGLProgram;
  protected basicVertexSource: string = vertexSource;
  protected basicFragmentSource: string = fragmentSource;

  protected initGL(): void {
    this.canvas = document.querySelector("#view") as HTMLCanvasElement;
    this.gl = this.canvas.getContext("webgl") as WebGLRenderingContext;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  protected testDidStart(): void {
    this.initGL();

    const program: WebGLProgram = createProgram(
      this.gl,
      vertexSource,
      fragmentSource
    );

    const buf = this.gl.createBuffer() as WebGLBuffer;
    const vertices = [-1, -1, 1, -1, 1, 1, -1, 1];

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    );

    const indexBuf = this.gl.createBuffer() as WebGLBuffer;
    const indices = [0, 1, 2, 0, 2, 3];

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuf);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    );

    this.gl.useProgram(program);

    const pos = this.gl.getAttribLocation(program, "pos");

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
    this.gl.enableVertexAttribArray(pos);
    this.gl.vertexAttribPointer(pos, 4, this.gl.FLOAT, false, 4 * 2, 0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuf);
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
  }

  protected testWillDispose(): void {
    if (this.gl) {
      this.gl.useProgram(null);
    }
  }

  public get innerHTML(): string {
    return `
    <div class="test-wrapper">
      <canvas id="view" class="fit-screen"></canvas>
    </div>
  `;
  }

  public get styles(): string[] | null {
    return [
      `
      body {
        padding: 0px;
        margin: 0px;
      }
    
      .fit-screen {
        width: 100%;
        height: 100%;
      }
    `
    ];
  }
}
