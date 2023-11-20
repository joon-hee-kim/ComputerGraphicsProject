var gl;
var points;

window.onload = function init(){
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) {alert("WebGL isn't available")};

    var vertices_with_strip = [
        vec2(-0.5, 0.5),
        vec2(-0.5, -0.5), 
        vec2(0.5, 0.5), 
        vec2(0.5 , -0.5)
    ];

    var vertices_with_triangle_and_fan = [
        vec2(-0.5, 0.5),
        vec2(-0.5, -0.5),
        vec2(0.5, 0.5),
        vec2(0.5, -0.5),
        vec2(0.5, 0.5),
        vec2(-0.5, -0.5)
    ];

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    //gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices_with_strip), gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices_with_triangle_and_fan), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0 , 0);
    gl.enableVertexAttribArray(vPosition);
    render();
};

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

