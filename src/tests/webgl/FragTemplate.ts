import WebGLBase from "./WebGLBase";
import {
  createProgram,
  createArrayBuffer,
  createElementArrayBuffer
} from "./glu/glu";

interface VertexPointer {
  attribute: number;
  size: number;
  type: number;
  normalized: boolean;
  stride: number;
  offset: number;
}

interface IndexPointer {
  mode: number;
  count: number;
  type: number;
  offset: number;
}

interface Geometry {
  indices: WebGLBuffer;
  vertices: WebGLBuffer;
  indexPointer: IndexPointer;
  attrs: Record<string, VertexPointer>;
}

class Renderer {
  public readonly gl: WebGLRenderingContext;
  public readonly program: WebGLProgram;

  private attrs: Record<string, number> = {};
  private uniforms: Record<string, WebGLUniformLocation | null> = {};

  public constructor(
    gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string
  ) {
    this.gl = gl;
    this.program = createProgram(this.gl, vertexSource, fragmentSource);
  }

  public activate(): void {
    this.gl.useProgram(this.program);
  }

  public deactivate(): void {
    this.gl.useProgram(null);
  }

  public render(geo: Geometry): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geo.vertices);

    for (const [name, pointer] of Object.entries(geo.attrs)) {
      const index = this.getAttributeLocation(name);

      this.gl.vertexAttribPointer(
        index,
        pointer.size,
        pointer.type,
        pointer.normalized,
        pointer.stride,
        pointer.offset
      );
    }

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, geo.indices);
    this.gl.drawElements(
      this.gl.TRIANGLES,
      geo.indexPointer.count,
      geo.indexPointer.type,
      geo.indexPointer.offset
    );
  }

  public getAttributeLocation(name: string): number {
    if (typeof this.attrs[name] === "undefined") {
      this.attrs[name] = this.gl.getAttribLocation(this.program, name);
      this.gl.enableVertexAttribArray(this.attrs[name]);
    }

    return this.attrs[name];
  }

  public getUniformLocation(name: string): WebGLUniformLocation | null {
    if (typeof this.uniforms[name] === "undefined") {
      this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
    }

    return this.uniforms[name];
  }

  public setUniform(location: string, ...values: number[]): void {
    if (this.uniforms[location]) {
      this.uniforms[location] = this.gl.getUniformLocation(
        this.program,
        location
      );
    }

    const len = values.length;
    const setUniform: (
      loc: WebGLUniformLocation,
      ...n: number[]
    ) => void = (this.gl as any)[`uniform${len}f`];

    console.log(setUniform, setUniform.name);

    setUniform.apply(this.gl, [
      this.uniforms[location] as WebGLUniformLocation,
      ...values
    ]);
  }

  public setUniformMat(location: string, mat: Float32Array): void {
    this.getUniformFunc(mat.length)(location, false, mat);
  }

  private getUniformFunc(
    len: number
  ): (
    loc: WebGLUniformLocation,
    transpose: boolean,
    mat: Float32Array
  ) => void {
    switch (len) {
      case 4:
        return this.gl.uniformMatrix2fv;

      case 9:
        return this.gl.uniformMatrix3fv;
    }

    return this.gl.uniformMatrix4fv;
  }

  public get running(): boolean {
    return this.program === this.gl.getParameter(this.gl.CURRENT_PROGRAM);
  }
}

const frag = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform vec4 color;

  void main() {
    gl_FragColor = color;
  }
`;

export function getSmapleGeometry(gl: WebGLRenderingContext): Geometry {
  const vertexBuf = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
  const indexBuf = new Uint16Array([0, 1, 2, 0, 2, 3]);

  return {
    vertices: createArrayBuffer(gl, vertexBuf),
    indices: createElementArrayBuffer(gl, indexBuf),
    attrs: {
      pos: {
        attribute: 0,
        normalized: false,
        offset: 0,
        stride: 4 * 2,
        size: 4,
        type: gl.FLOAT
      }
    },
    indexPointer: {
      count: 6,
      mode: gl.TRIANGLES,
      offset: 0,
      type: gl.UNSIGNED_SHORT
    }
  };
}

export default class FragTemplate extends WebGLBase {
  private renderer: Renderer;

  protected testDidStart(): void {
    super.testDidStart();

    const renderer = new Renderer(this.gl, this.basicVertexSource, frag);
    const geo: Geometry = getSmapleGeometry(this.gl);

    renderer.activate();
    // renderer.setUniform("color", 0, 1, 0, 1);
    renderer.render(geo);

    this.renderer = renderer;
  }
}
