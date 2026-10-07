import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface LiquidImageProps {
  src: string;
  alt: string;
  className?: string;
}

const VERTEX = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// Ondulation lente (bruit) + onde qui suit le doigt / la souris, avec léger décalage des couleurs
const FRAGMENT = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_res;
uniform vec2 u_img;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_hover;
varying vec2 v_uv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  float rs = u_res.x / u_res.y;
  float ri = u_img.x / u_img.y;
  vec2 scale = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  vec2 uv = (v_uv - 0.5) * scale * 0.97 + 0.5;

  float t = u_time * 0.12;
  vec2 flow = vec2(noise(v_uv * 3.0 + t), noise(v_uv * 3.0 - t + 7.0)) - 0.5;
  uv += flow * 0.02;

  vec2 d = v_uv - u_mouse;
  d.x *= rs;
  float dist = length(d);
  float ripple = sin(dist * 34.0 - u_time * 4.5) * exp(-dist * 5.0) * 0.03 * u_hover;
  uv += normalize(d + 0.0001) * ripple;

  float split = ripple * 0.9;
  vec3 col;
  col.r = texture2D(u_tex, uv + vec2(split, 0.0)).r;
  col.g = texture2D(u_tex, uv).g;
  col.b = texture2D(u_tex, uv - vec2(split, 0.0)).b;
  gl_FragColor = vec4(col, 1.0);
}`;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

/**
 * Photo « liquide » rendue en WebGL : elle ondule doucement et réagit au pointeur.
 * L'image classique reste dessous : elle s'affiche si WebGL est indisponible
 * ou si l'utilisateur a demandé à réduire les animations.
 */
export const LiquidImage: React.FC<LiquidImageProps> = ({ src, alt, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) return;
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u('u_res');
    const uImg = u('u_img');
    const uTime = u('u_time');
    const uMouse = u('u_mouse');
    const uHover = u('u_hover');

    let frame = 0;
    let visible = true;
    let disposed = false;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let hover = 0;
    let hoverTarget = 0;
    let lastMove = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    const render = (now: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(render);
      if (!visible) return;
      // L'onde s'éteint doucement quand le pointeur ne bouge plus
      if (now - lastMove > 900) hoverTarget = 0;
      hover += (hoverTarget - hover) * 0.04;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      resize();
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHover, hover);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / rect.width;
      mouse.ty = 1 - (e.clientY - rect.top) / rect.height;
      hoverTarget = 1;
      lastMove = performance.now();
    };
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerMove);

    // On ne calcule rien quand l'image n'est pas à l'écran
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);

    let texture: WebGLTexture | null = null;
    const image = new Image();
    image.onload = () => {
      if (disposed) return;
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform2f(uImg, image.naturalWidth, image.naturalHeight);
      frame = requestAnimationFrame(render);
      setReady(true);
    };
    image.src = src;

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerMove);
      // Libère les ressources sans perdre le contexte : React peut remonter le composant sur le même canevas
      if (texture) gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [src, reduceMotion]);

  return (
    <div className={`relative ${className}`}>
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      {!reduceMotion && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 touch-pan-y ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
