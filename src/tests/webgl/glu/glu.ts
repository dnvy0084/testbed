export function createProgram(
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

export function createShader(
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

export function createBuffer(
  gl: WebGLRenderingContext,
  target: number,
  data: ArrayBuffer,
  usage?: number
): WebGLBuffer {
  const buf = gl.createBuffer() as WebGLBuffer;
  const drawUsage = typeof usage === "undefined" ? gl.STATIC_DRAW : usage;

  gl.bindBuffer(target, buf);
  gl.bufferData(target, data, drawUsage);
  gl.bindBuffer(target, null);

  return buf;
}

export function createArrayBuffer(
  gl: WebGLRenderingContext,
  vertices: Float32Array,
  usage?: number
): WebGLBuffer {
  return createBuffer(gl, gl.ARRAY_BUFFER, vertices, usage);
}

export function createElementArrayBuffer(
  gl: WebGLRenderingContext,
  indices: Uint16Array,
  usage?: number
): WebGLBuffer {
  return createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices, usage);
}
