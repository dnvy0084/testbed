import TestBase from "../TestBase";

const style = `
  body {
    padding: 0px;
    margin: 0px;
  }

  .fit-screen {
    width: 100%;
    height: 100%;
  }

  #view {
    border: 1px solid black;
  }
`;

const html = `
  <div class="test-wrapper">
    <canvas id="view" class="fit-screen"></canvas>
  </div>
`;

const vertexSource = `
attribute vec2 pos;

void main() {
  gl_Position = vec4(pos, 0.0, 1.0);
}
`;

const fragmentSource = `
precision mediump float;

void main() {
  gl_FragColor = vec4(0.8, 0.0, 0.0, 1.0);
}
`;

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram {
  const program = gl.createProgram() as WebGLProgram;
  const tuple: [number, string][] = [
    [gl.VERTEX_SHADER, vertexSource],
    [gl.FRAGMENT_SHADER, fragmentSource]
  ];

  for (const [type, source] of tuple) {
    const shader = createShader(gl, type, source);

    gl.attachShader(program, shader);
  }

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program));
  }

  return program;
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type) as WebGLShader;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
  }

  return shader;
}

export default class WebGLBase extends TestBase {
  private gl: WebGLRenderingContext;

  protected testDidStart(): void {
    this.layout(html, style);

    const canvas = document.querySelector("#view") as HTMLCanvasElement;

    this.gl = canvas.getContext("webgl") as WebGLRenderingContext;

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
}
