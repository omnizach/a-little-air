var three = require('three');

var Tile = function(mesh, x, y, w, h) {
  this.mesh = mesh;
  this._width = w;
  this._height = h;

  var v0 = this.mesh.geometry.vertices.length;

  this.vertices = [
    new three.Vector3(x,   y,   10),
    new three.Vector3(x+w, y,   10),
    new three.Vector3(x+w, y+h, 10),
    new three.Vector3(x,   y+h, 10)
  ];

  Array.prototype.push.apply(this.mesh.geometry.vertices, this.vertices);

  this.face1 = new three.Face3(v0, v0+1, v0+2);
  this.face2 = new three.Face3(v0, v0+2, v0+3);

  this.mesh.geometry.faces.push(this.face1, this.face2);
};

Object.defineProperty(Tile.prototype, 'color', {
  get: function() {
    return this.face1.color.getHex();
  },
  set: function(c) {
    this.face1.color.set(c);
    this.face2.color.set(c);
    this.mesh.geometry.colorsNeedUpdate = true;
  }
});

Object.defineProperty(Tile.prototype, 'x', {
  get: function() {
    return this.vertices[0].x;
  },
  set: function(x) {
    this.vertices[0].x = this.vertices[3].x = x;
    this.vertices[1].x = this.vertices[2].x = x + this._width;
    this.mesh.geometry.verticesNeedUpdate = true;
  }
});

Object.defineProperty(Tile.prototype, 'y', {
  get: function() {
    return this.vertices[0].y;
  },
  set: function(y) {
    this.vertices[0].y = this.vertices[1].y = y;
    this.vertices[2].y = this.vertices[3].y = y + this._height;
    this.mesh.geometry.verticesNeedUpdate = true;
  }
});

Object.defineProperty(Tile.prototype, 'width', {
  get: function() {
    return this._width;
  },
  set: function(w) {
    this._width = w;
    this.vertices[1].x = this.vertices[2].x = this.vertices[0].x + w;
    this.mesh.geometry.verticesNeedUpdate = true;
  }
});

Object.defineProperty(Tile.prototype, 'height', {
  get: function() {
    return this._height;
  },
  set: function(h) {
    this._height = h;
    this.vertices[2].y = this.vertices[3].y = this.vertices[0].y + h;
    this.mesh.geometry.verticesNeedUpdate = true;
  }
});

Tile.prototype.worldVertices = function() {
  return this.vertices.map(function(v) {
    return this.mesh.localToWorld(v.clone());
  }, this);
};

var TileMesh = function() {
  three.Mesh.call(this,
                  new three.Geometry(),
                  new three.MeshBasicMaterial({ 
                    vertexColors: three.FaceColors,
                    transparent: true,
                    opacity: 0.9,
                    blending: three.AdditiveBlending 
                  }));

  this.tiles = [];
};

TileMesh.prototype = Object.create(three.Mesh.prototype);

TileMesh.prototype.addTile = function(dim) {
  this.tiles.push(new Tile(this, dim[0][0], dim[0][1], dim[1][0], dim[1][1]));
};

module.exports = TileMesh;