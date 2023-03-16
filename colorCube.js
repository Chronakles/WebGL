//
//	Color Cube
//

const {vec3} = glMatrix;


var norms = [
        [-0.57, -0.57,  0.57, 1.0],
        [-0.57,  0.57,  0.57, 1.0],
        [ 0.57,  0.57,  0.57, 1.0],
        [ 0.57, -0.57,  0.57, 1.0],
        [-0.57, -0.57, -0.57, 1.0],
        [-0.57,  0.57, -0.57, 1.0],
        [ 0.57,  0.57, -0.57, 1.0],
        [ 0.57, -0.57, -0.57, 1.0]
    ];

var vertices = [
        [-0.5, -0.5,  0.5, 1.0 ],
        [-0.5,  0.5,  0.5, 1.0 ],
        [ 0.5,  0.5,  0.5, 1.0 ],
        [ 0.5, -0.5,  0.5, 1.0 ],
        [-0.5, -0.5, -0.5, 1.0 ],
        [-0.5,  0.5, -0.5, 1.0 ],
        [ 0.5,  0.5, -0.5, 1.0 ],
        [ 0.5, -0.5, -0.5, 1.0 ]
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

function quad(a, b, c, d) {

     /*var t1 = vec3.create();
     vec3.subtract(t1, vertices[b], vertices[a]);

     var t2 = vec3.create();
     vec3.subtract(t2, vertices[c], vertices[b]);

     var normal = vec3.create();
     vec3.cross(normal, t1, t2);
     //var normal = vec3(normal);

     console.log(normal);

     cubePoints.push(vertices[a]);
     cubeNormals.push(normal);
     cubePoints.push(vertices[b]);
     cubeNormals.push(normal);
     cubePoints.push(vertices[c]);
     cubeNormals.push(normal);
     cubePoints.push(vertices[a]);
     cubeNormals.push(normal);
     cubePoints.push(vertices[c]);
     cubeNormals.push(normal);
     cubePoints.push(vertices[d]);
     cubeNormals.push(normal);  */ 
     

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        cubePoints.push(vertices[indices[i]]);
        // for solid colored faces use
        //colors.push(vertexColors[a]);
        cubeNormals.push(norms[indices[i]]);
    }
}


function colorCube(points, colors, cubeNpormals)
{
    quad( 1, 0, 3, 2 ); //front
    quad( 2, 3, 7, 6 ); //left
    quad( 3, 0, 4, 7 ); //bottom
    quad( 6, 5, 1, 2 ); //top
    quad( 4, 5, 6, 7 ); //back
    quad( 5, 4, 0, 1 ); //right
}

/*function quad(a, b, c, d)
{
    var vertices = [
        [-0.5, -0.5,  0.5, 1.0 ],
        [-0.5,  0.5,  0.5, 1.0 ],
        [ 0.5,  0.5,  0.5, 1.0 ],
        [ 0.5, -0.5,  0.5, 1.0 ],
        [-0.5, -0.5, -0.5, 1.0 ],
        [-0.5,  0.5, -0.5, 1.0 ],
        [ 0.5,  0.5, -0.5, 1.0 ],
        [ 0.5, -0.5, -0.5, 1.0 ]
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[a]);

    }

}*/