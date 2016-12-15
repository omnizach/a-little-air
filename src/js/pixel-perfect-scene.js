// Pixel Perfect Scene
// Input dimensions match output dimensions
// aspect ratio matches
// orthographic, no depth scaling so x and y are never distorted

var three = require('three');

module.exports = function pixelPerfectScene(element, settings) {
  settings = settings || {};

  var width = settings.width || 1280,
      height = settings.height || 720,
      depth = settings.depth || 1280,
      renderer = settings.renderer || new three.WebGLRenderer({ antialias: true }),
      scene = settings.scene || new three.Scene(),
      camera = settings.camera || new three.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -depth, depth);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  element.innerHTML = ''; // remove anything, including if this has been added previously. Messy and effective.

  element.appendChild(renderer.domElement);

  var my = {};

  my.render = function() {
    renderer.render(scene, camera);
    return my;
  };

  my.add = function(object) {
    scene.add(object);
    return my;
  };

  return my;
};