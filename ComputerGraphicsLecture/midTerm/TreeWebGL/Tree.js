var gl;
var points;

window.onload = function init(){
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) {alert("WebGL isn't available")};

    var vertex= [
        vec2(0, 1),
        vec2(-0.5, 0.5), 
        vec2(0.5, 0.5), // triangle 1 
        vec2(0, 0.5),
        vec2(-0.5, 0),
        vec2(0.5, 0), // triangle 2
        vec2(0, 0),
        vec2(-0.5, -0.5),
        vec2(0.5, -0.5), // triangle 3
        vec2(-0.15, -0.5),
        vec2(0.15, -0.5),
        vec2(-0.15, -1), //triangle 4(밑변)
        vec2(0.15, -0.5),
        vec2(-0.15, -1),
        vec2(0.15, -1) // triangle 5(밑변)
    ];

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

   
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertex), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0 , 0);
    gl.enableVertexAttribArray(vPosition);

    var uColor = gl.getUniformLocation(program, "uColor");

    gl.clear(gl.COLOR_BUFFER_BIT);
    //leaf Color
    gl.uniform4fv(uColor, [0, 1, 0, 1]);
    gl.drawArrays(gl.TRIANGLES, 0, 9);

    //body Color
    gl.uniform4f(uColor, 0.5, 0.25, 0, 1);
    gl.drawArrays(gl.TRIANGLES, 9, 6);
};

