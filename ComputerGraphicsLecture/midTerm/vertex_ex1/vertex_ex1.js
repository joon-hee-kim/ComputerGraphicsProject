var gl;

window.onload = function init(){
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) {alert("WebGL isn't available")};

    var vertices = [
        vec2(10, 20),
        vec2(80, 20),
        vec2(10, 30),
        vec2(10, 30),
        vec2(80, 20),
        vec2(80, 30),
    ];

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    var vResolution = gl.getUniformLocation(program, "vResolution");
    gl.uniform2f(vResolution, gl.canvas.width, gl.canvas.height);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0 , 0);
    gl.enableVertexAttribArray(vPosition);
    render();
};

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

