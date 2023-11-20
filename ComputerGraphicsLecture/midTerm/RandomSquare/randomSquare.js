var gl;

window.onload = function init(){
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) {alert("WebGL isn't available")};

    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;

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
    var fColor = gl.getUniformLocation(program, "uColor");
    
    gl.vertexAttribPointer(vPosition, size, type, normalize, stride, offset);
    gl.enableVertexAttribArray(vPosition);
    gl.uniform2f(vResolution, gl.canvas.width, gl.canvas.height);


    for(ii = 0; ii < 50; ++ii){
        setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

        gl.uniform4f(fColor, Math.random(), Math.random(), Math.random(), 1);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }
};

function randomInt(range){
    return Math.floor(Math.random() * range);
}

function setRectangle(gl, x, y, width, height){
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y * height;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]), gl.STATIC_DRAW);
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

