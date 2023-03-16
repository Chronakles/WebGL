"use strict";

var canvas;
var gl;

const {mat4} = glMatrix;

var numTimesToSubdivide = 4;

var programGD;
var programGS;
var programPD;
var programPS;

var cubePoints = [];
var cubeNormals = [];

var tetraPoints = [];
var tetraNormals = [];


var near = -10;
var far = 10;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var topCube;
var bottomCube;
var leftCube;
var rightCube;
var topLeftCube;
var topRightCube;
var bottomRightCube;
var bottomLeftCube;
var shapes = [];

var ntopCube;
var nbottomCube;
var nleftCube;
var nrightCube;
var ntopLeftCube;
var ntopRightCube;
var nbottomRightCube;
var nbottomLeftCube;
var normalsArray = [];

var ytop = 1.0;
var bottom = -1.0;

var va = [0.0, 0.0, -1.0,1];
var vb = [0.0, 0.942809, 0.333333, 1];
var vc = [-0.816497, -0.471405, 0.333333, 1];
var vd = [0.816497, -0.471405, 0.333333,1];

var lightPosition = [1.0, 5.0, -3.0, 0.0 ];
var lightAmbient = [0.2, 0.2, 0.2, 1.0 ];
var lightDiffuse = [ 1.0, 1.0, 1.0, 1.0 ];
var lightSpecular = [ 1.0, 1.0, 1.0, 1.0 ];

var materialAmbient = [ 1.0, 0.0, 1.0, 1.0 ];
var materialDiffuse = [ 1.0, 0.8, 0.0, 1.0 ];
var materialSpecular = [ 1.0, 1.0, 1.0, 1.0 ];
var materialShininess = 20.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var ambientProduct, diffuseProduct, specularProduct;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;

var axis = "y";

var eye;
var at = [0.0, 0.0, 0.0];
var up = [0.0, 1.0, 0.0];

var nBuffer;
var vBuffer;


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.2, 0.2, 0.2, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    programGD = initShaders( gl, "vertex-shader", "fragment-shader" );
    programGS = initShaders( gl, "vertex-shader2", "fragment-shader2" );
    programPD = initShaders( gl, "vertex-shader3", "fragment-shader3" );
    programPS = initShaders( gl, "vertex-shader4", "fragment-shader4" );


    ambientProduct = multiplyVec(lightAmbient, materialAmbient);
    diffuseProduct = multiplyVec(lightDiffuse, materialDiffuse);
    specularProduct = multiplyVec(lightSpecular, materialSpecular);


    colorTetra();
    colorCube();

    setCubeCord();

    initProg(programGD);

    document.getElementById( "xButton" ).onclick = function () {
        axis = "x";
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = "y";
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = "z";
    };

    window.addEventListener("keydown", function() {
        switch (event.keyCode) {
            case 85: // 'u’ key gouraud diffuse
                initProg(programGD);
                break;
            case 73: // ’i’ key gouraud specular
                initProg(programGS);
                break;
            case 79: // ’o’ key phong diffuse
                initProg(programPD);
                break;
            case 80: // ’p’ key phong specular
                initProg(programPS);
                break;
        }
    });


    render();
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    

    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(tetraNormals.flat()), gl.STATIC_DRAW );

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tetraPoints.flat()), gl.STATIC_DRAW);

    theta = 0.01;    

    if(axis == "x"){
        mat4.rotateX(modelViewMatrix, modelViewMatrix, theta);
    }else if(axis == "y"){
        mat4.rotateY(modelViewMatrix, modelViewMatrix, theta);
    }else if(axis == "z"){
        mat4.rotateZ(modelViewMatrix, modelViewMatrix, theta);
    }

    normalMatrix = [
        [modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]],
        [modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]],
        [modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2]]
    ];

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, modelViewMatrix );
    gl.uniformMatrix3fv(normalMatrixLoc, false, normalMatrix.flat() );

    for( var i=0; i<index; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );

    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(cubeNormals.flat()), gl.STATIC_DRAW );

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    for(var i = 0; i < 9; i++){
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapes[i]), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, cubePoints.length);

    }

    window.requestAnimFrame(render);
}


function multiplyVec( u, v )
{
    var result = [];

    if ( u.length != v.length ) {
        throw "mult(): vectors are not the same dimension";
    }

    for ( var i = 0; i < u.length; ++i ) {
        result.push( u[i] * v[i] );
    }

    return result;
    
}

function setCubeCord(){
    topCube = cubePoints.flat();
    bottomCube = cubePoints.flat();
    leftCube = cubePoints.flat();
    rightCube = cubePoints.flat();
    topLeftCube = cubePoints.flat();
    topRightCube = cubePoints.flat();
    bottomRightCube = cubePoints.flat();
    bottomLeftCube = cubePoints.flat();

    ntopCube = cubeNormals.flat();
    nbottomCube = cubeNormals.flat();
    nleftCube = cubeNormals.flat();
    nrightCube = cubeNormals.flat();
    ntopLeftCube = cubeNormals.flat();
    ntopRightCube = cubeNormals.flat();
    nbottomRightCube = cubeNormals.flat();
    nbottomLeftCube = cubeNormals.flat();

    for(let i = 0; i < topCube.length; i++){
        if(i % 4 == 0){
            leftCube[i] -= 2.0;
            rightCube[i] += 2.0;
            topLeftCube[i] -= 1.5;
            topRightCube[i] += 1.5;
            bottomRightCube[i] += 1.5;
            bottomLeftCube[i] -= 1.5;

            nleftCube[i] -= 2.0;
            nrightCube[i] += 2.0;
            ntopLeftCube[i] -= 1.5;
            ntopRightCube[i] += 1.5;
            nbottomRightCube[i] += 1.5;
            nbottomLeftCube[i] -= 1.5;
        }
        if(i % 4 == 1){
            topCube[i] += 2.0;
            topRightCube[i] += 1.5;
            bottomCube[i] -= 2.0;
            topLeftCube[i] += 1.5;
            bottomRightCube[i] -= 1.5;
            bottomLeftCube[i] -= 1.5;

            ntopCube[i] += 2.0;
            nbottomCube[i] -= 2.0;
            ntopLeftCube[i] += 1.5;
            ntopRightCube[i] += 1.5;
            nbottomRightCube[i] -= 1.5;
            nbottomLeftCube[i] -= 1.5;
        }
    }
    shapes.push(topCube);
    shapes.push(bottomCube);
    shapes.push(leftCube);
    shapes.push(rightCube);
    shapes.push(topRightCube);
    shapes.push(topLeftCube);
    shapes.push(bottomLeftCube);
    shapes.push(bottomRightCube);


    ntopCube;
    nbottomCube;
    nleftCube;
    nrightCube;
    ntopLeftCube;
    ntopRightCube;
    nbottomRightCube;
    nbottomLeftCube;
    normalsArray.push(ntopCube);
    normalsArray.push(nbottomCube);
    normalsArray.push(nleftCube);
    normalsArray.push(nrightCube);
    normalsArray.push(ntopLeftCube);
    normalsArray.push(ntopRightCube);
    normalsArray.push(nbottomRightCube);
    normalsArray.push(nbottomLeftCube);
}


function initProg(program){
    gl.useProgram(program);
    nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(tetraNormals.flat()), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tetraPoints.flat()), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    eye = [radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta)];

    modelViewMatrix = mat4.create();
    mat4.lookAt(modelViewMatrix, eye, at , up);
    mat4.scale(modelViewMatrix, modelViewMatrix, [0.3, 0.3, 0.3]);

    projectionMatrix = mat4.create();
    const aspectRatio = canvas.width / canvas.height;
    mat4.ortho(projectionMatrix, -aspectRatio, aspectRatio, bottom, ytop, near, far);

    // normal matrix only really need if there is nonuniform scaling
    // it's here for generality but since there is
    // no scaling in this example we could just use modelView matrix in shaders

    normalMatrix = [
        [modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]],
        [modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]],
        [modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2]]
    ];

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, modelViewMatrix );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix );
    gl.uniformMatrix3fv(normalMatrixLoc, false, normalMatrix.flat() );

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"), ambientProduct.flat() );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"), diffuseProduct.flat() );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"), specularProduct.flat() );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"), lightPosition.flat() );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"), materialShininess );
}