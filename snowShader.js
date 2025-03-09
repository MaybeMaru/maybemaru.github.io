// Stolen snow shader from:
// https://www.shadertoy.com/view/3ld3zX
// All credits to the original creators

const canvas = document.getElementById("shaderCanvas");
const gl = canvas.getContext("webgl");

const vertexShaderSource = `
    attribute vec2 position;
    varying vec2 fragCoord;
    void main() {
        fragCoord = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec2 fragCoord;
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec3 bgColor;

    #define HASHSCALE1 0.1031
    #define HASHSCALE3 vec3(0.1031, 0.1030, 0.0973)

    float Hash11(float p) {
        vec3 p3 = fract(vec3(p) * HASHSCALE1);
        p3 += dot(p3, p3.yzx + 19.19);
        return fract((p3.x + p3.y) * p3.z);
    }

    vec2 Hash22(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
        p3 += dot(p3, p3.yzx + 19.19);
        return fract((p3.xx + p3.yz) * p3.zy);
    }

    vec3 SnowSingleLayer(vec2 uv, float layer) {
        uv *= (3.0 + layer);
        float xOffset = uv.y * (((Hash11(layer) * 2.0 - 1.0) * 0.5 + 1.0) * 0.4);
        float yOffset = (0.25 * iTime);
        uv += vec2(xOffset, yOffset);
        vec2 rgrid = Hash22(floor(uv) + (31.1759 * layer));
        uv = fract(uv);
        uv -= (rgrid * 2.0 - 1.0) * 0.35;
        uv -= 0.5;
        float r = length(uv) * 2.0;
        float circleSize = 0.05 * (1.0 + 0.3 * sin(iTime * 0.1));
        float val = smoothstep(circleSize, -circleSize, r);
        return vec3(val) * rgrid.x;
    }

    void main() {
        vec2 uv = fragCoord * iResolution;
        uv /= iResolution.xy;
        uv *= vec2(iResolution.x / iResolution.y, 1.0);
        vec3 acc = vec3(0.0);
        for (float i = 0.0; i < 10.0; i++) {
            acc += SnowSingleLayer(uv, i);
        }
        gl_FragColor = vec4(bgColor + acc, 1.0);
    }
`;

// resize to fit the screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

// make canvas shader crap
const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// set up a fullscreen triangle
const vertices = new Float32Array([
    -1, -1,
     3, -1,
    -1,  3
]);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const position = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

const timeUniform = gl.getUniformLocation(program, "iTime");
const resolutionUniform = gl.getUniformLocation(program, "iResolution");
const bgColorUniform = gl.getUniformLocation(program, "bgColor");

gl.uniform2f(resolutionUniform, canvas.width, canvas.height);

// get background color from css
function getCSSBackgroundColor() {
    const computedStyle = window.getComputedStyle(document.body);
    const bgColor = computedStyle.backgroundColor.match(/\d+/g).map(Number);
    return bgColor.length === 3 ? bgColor.map(c => c / 255.0) : [0, 0, 0];
}

// get global time to be consistent between pages
function getGlobalTime() {
    return (Date.now() % 86400000) / 1000.0;
}

function render() {
    const bgColor = getCSSBackgroundColor();
    gl.uniform3f(bgColorUniform, bgColor[0], bgColor[1], bgColor[2]);
    gl.uniform1f(timeUniform, getGlobalTime());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);