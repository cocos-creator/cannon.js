module.exports = Cylinder;

var Shape = require('./Shape');
var Vec3 = require('../math/Vec3');
var Quaternion = require('../math/Quaternion');
var ConvexPolyhedron = require('./ConvexPolyhedron');
var CMath = require('../math/CMath');

/**
 * @class Cylinder
 * @constructor
 * @extends ConvexPolyhedron
 * @author schteppe / https://github.com/schteppe
 * @param {Number} radiusTop
 * @param {Number} radiusBottom
 * @param {Number} height
 * @param {Number} numSegments The number of segments to build the cylinder out of
 */
function Cylinder( radiusTop, radiusBottom, height , numSegments , isDirY) {
    if (isDirY) {
        var N = numSegments,
        cos = CMath.cos,
        sin = CMath.sin;
        var halfH = height / 2;
        var vertices = [];
        var indices = [];
        var tf = [0];
        var bf = [1];
        var axes = [];
        var theta = Math.PI * 2 / N;
        for (var i = 0; i < N; i++) {
            vertices.push(new Vec3(radiusTop * cos(theta * i), halfH, radiusTop * sin(theta * i)));
            vertices.push(new Vec3(radiusTop * cos(theta * i), -halfH, radiusTop * sin(theta * i)));
            if (i < N - 1) {
                indices.push([2 * i + 2, 2 * i + 3, 2 * i + 1, 2 * i]);
                tf.push(2 * i + 2);
                bf.push(2 * i + 3);
            } else {
                indices.push([0, 1, 2 * i + 1, 2 * i]);
            }
            if (N % 2 === 1 || i < N / 2) axes.push(new Vec3(cos(theta * (i + 0.5)), 0, sin(theta * (i + 0.5))));            
        }
        indices.push(bf);
        var temp = [];
        for (var i = 0; i < tf.length; i++) temp.push(tf[tf.length - i - 1]);    
        indices.push(temp);
        axes.push(new Vec3(0, 1, 0));
        ConvexPolyhedron.call(this, vertices, indices, axes);
        return;
    }
    var N = numSegments,
        verts = [],
        axes = [],
        faces = [],
        bottomface = [],
        topface = [],
        cos = CMath.cos,
        sin = CMath.sin;

    // First bottom point
    verts.push(new Vec3(radiusBottom*cos(0),
                               radiusBottom*sin(0),
                               -height*0.5));
    bottomface.push(0);

    // First top point
    verts.push(new Vec3(radiusTop*cos(0),
                               radiusTop*sin(0),
                               height*0.5));
    topface.push(1);

    for(var i=0; i<N; i++){
        var theta = 2*Math.PI/N * (i+1);
        var thetaN = 2*Math.PI/N * (i+0.5);
        if(i<N-1){
            // Bottom
            verts.push(new Vec3(radiusBottom*cos(theta),
                                       radiusBottom*sin(theta),
                                       -height*0.5));
            bottomface.push(2*i+2);
            // Top
            verts.push(new Vec3(radiusTop*cos(theta),
                                       radiusTop*sin(theta),
                                       height*0.5));
            topface.push(2*i+3);

            // Face
            faces.push([2*i+2, 2*i+3, 2*i+1,2*i]);
        } else {
            faces.push([0,1, 2*i+1, 2*i]); // Connect
        }

        // Axis: we can cut off half of them if we have even number of segments
        if(N % 2 === 1 || i < N / 2){
            axes.push(new Vec3(cos(thetaN), sin(thetaN), 0));
        }
    }
    faces.push(topface);
    axes.push(new Vec3(0,0,1));

    // Reorder bottom face
    var temp = [];
    for(var i=0; i<bottomface.length; i++){
        temp.push(bottomface[bottomface.length - i - 1]);
    }
    faces.push(temp);

    ConvexPolyhedron.call( this, verts, faces, axes );
}

Cylinder.prototype = new ConvexPolyhedron();
