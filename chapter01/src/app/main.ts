import '../styles/main.css'

const VSHADER : string = 
`void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0); // Coordinates
    gl_PointSize = 10.0; // Set the point size
}
`

const FSHADER : string  = 
`void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Set the Color
}
`

function loadSh(gl: WebGLRenderingContext, 
                shType: number, 
                shStr: string): WebGLShader 
{
    const sh = <WebGLShader> gl.createShader(shType)
    if (sh == null) {
        console.error('NOSHADER')
        return null
    }
    gl.shaderSource(sh, shStr)
    gl.compileShader(sh)
    const compiled = gl.getShaderParameter(sh, gl.COMPILE_STATUS)
    if (!compiled) {
        console.error(`COMPILEDSHERR: ${gl.getShaderInfoLog(sh)}`)
        gl.deleteShader(sh)
        return null
    }
    return sh
}

function createProgram( gl: WebGLRenderingContext, 
                        vertexSh: string, 
                        fragmentSh: string): WebGLProgram 
{
    const vSh = loadSh(gl, gl.VERTEX_SHADER, vertexSh)
    const fSh = loadSh(gl, gl.FRAGMENT_SHADER, fragmentSh)
    const prg = gl.createProgram()
    if (!prg || !vSh || !fSh) {
        return null
    }
    gl.attachShader(prg, vSh)
    gl.attachShader(prg, fSh)
    gl.linkProgram(prg)
    const linkd = gl.getProgramParameter(prg, gl.LINK_STATUS)
    if (!linkd) {
        console.error(`NOLINKD: ${gl.getProgramInfoLog(prg)}`)
        gl.deleteProgram(prg)
        gl.deleteShader(fSh)
        gl.deleteShader(vSh)
        return null
    }
    return prg
}

function init( gl: WebGLRenderingContext,
                vertexSh: string, 
                fragmentSh: string) : WebGLProgram 
{
    const prg = createProgram(gl, vertexSh, fragmentSh)
    if (!prg) {
        console.error('NOPROGRAM')
        return null
    }    
    gl.useProgram(prg)
    return prg
}

(function () {
    const c = <HTMLCanvasElement> document.querySelector('#gx')
    const gl = <WebGLRenderingContext> c.getContext("webgl")
    if (!gl) {
        console.error('NOWEBGL')
        return
    }
    const prg = <WebGLProgram> init(gl, VSHADER, FSHADER)
    if (!prg) {
        console.error('INITFAIL')
        return
    }
    gl.clearColor(0.5, 0.5, 0.5, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.POINTS, 0, 1)
}())

