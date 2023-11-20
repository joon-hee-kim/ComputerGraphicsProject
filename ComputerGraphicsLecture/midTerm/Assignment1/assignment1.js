var gl;
var canvas;

window.onload = function init(){
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) {alert("WebGL isn't available")};

    var Vertices = [
        vec2(-1.0, 1.0),
        vec2(-1.0, -1.0),
        vec2(1.0, 1.0),
        vec2(1.0, -1.0), // background
        vec2(-0.8, 0.9),
        vec2(-0.8, -0.3),
        vec2(0.8, 0.9),
        vec2(0.8, -0.3), // Tab
        vec2(-0.8, 0.9),
        vec2(-0.8, 0.78),
        vec2(0.8, 0.9),
        vec2(0.8, 0.78), // topBar
        vec2(-0.7, 0.89),
        vec2(-0.77, 0.8),
        vec2(-0.63, 0.8), // red-button
        vec2(-0.53, 0.89),
        vec2(-0.6, 0.8),
        vec2(-0.46, 0.8), // yellow-button
        vec2(-0.36, 0.89),
        vec2(-0.43, 0.8),
        vec2(-0.29, 0.8), // yellow-button
        vec2(-0.9, -0.95),
        vec2(-0.95, -0.9),
        vec2(-0.95, -0.8),
        vec2(-0.9, -0.75),
        vec2(0.9, -0.75),
        vec2(0.95, -0.8),
        vec2(0.95, -0.9),
        vec2(0.9, -0.95), // underTab
        vec2(-0.9, -0.8),
        vec2(-0.9, -0.9),
        vec2(-0.8, -0.8),
        vec2(-0.8, -0.9), // menu
        vec2(-0.7, -0.8),
        vec2(-0.7, -0.9),
        vec2(-0.6, -0.8),
        vec2(-0.6, -0.9), // menu
        vec2(-0.5, -0.8),
        vec2(-0.5, -0.9),
        vec2(-0.4, -0.8),
        vec2(-0.4, -0.9), // menu
        vec2(-0.3, -0.8),
        vec2(-0.3, -0.9),
        vec2(-0.2, -0.8),
        vec2(-0.2, -0.9), // menu
        vec2(-0.1, -0.8),
        vec2(-0.1, -0.9),
        vec2(0.0, -0.8),
        vec2(0.0, -0.9), // menu
        vec2(0.1, -0.8),
        vec2(0.1, -0.9),
        vec2(0.2, -0.8),
        vec2(0.2, -0.9), // menu
        vec2(0.3, -0.8),
        vec2(0.3, -0.9),
        vec2(0.4, -0.8),
        vec2(0.4, -0.9), // menu
        vec2(0.5, -0.8),
        vec2(0.5, -0.9),
        vec2(0.6, -0.8),
        vec2(0.6, -0.9), // menu
        vec2(0.7, -0.8),
        vec2(0.7, -0.9),
        vec2(0.8, -0.8),
        vec2(0.8, -0.9), // menu
    ];

    var backGroundColors = [
        vec4(0.89, 0.16, 0.84, 1.0),
        vec4(0.89, 0.16, 0.84, 1.0),
        vec4(0.93, 0.71, 0.72, 1.0),
        vec4(0.93, 0.71, 0.72, 1.0)
    ];

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(Vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var vColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(backGroundColors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var uColor = gl.getUniformLocation(program, "uColor");

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.uniform4fv(uColor, [1, 1, 1, 1]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);

    gl.uniform4fv(uColor, [0.8, 0.8, 0.8, 1.0]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 8, 4);

    gl.uniform4fv(uColor, [1.0, 0.26, 0.26, 1.0]);
    gl.drawArrays(gl.TRIANGLES, 12, 3);

    gl.uniform4fv(uColor, [1.0, 0.74, 0.0, 1.0]);
    gl.drawArrays(gl.TRIANGLES, 15, 3);

    gl.uniform4fv(uColor, [0.0, 0.83, 0.27, 1.0]);
    gl.drawArrays(gl.TRIANGLES, 18, 3);

    gl.uniform4fv(uColor, [0.95, 0.95, 0.95, 1.0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 21, 8);

    for(i = 0; i < 9; i++){
        gl.uniform4fv(uColor, [Math.random(), Math.random(), Math.random(), 1.0]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 29 + i*4, 4);
    }
}


