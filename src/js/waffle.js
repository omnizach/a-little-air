
var u = require('./util.js');

function waffle(data, settings) {
  settings = settings || {};

  var cellSize = u.rangify(settings.cellSize, [1,1]),
      padding = u.rangify(settings.padding, [0, 0]),
      segment = u.rangify(settings.segment, [10, 10]),
      width = settings.width || Infinity;

  var sc = segment[0] * segment[1], // cells per segment
      ss = data.length / sc,        // number of segments
      sr = width / segment[0];      // segments per row

  for (var i = 0; i < ss; i++) {
    var sx = Math.floor(i % sr) * (segment[0] * (cellSize[0]+padding[0]) + padding[0]), // segment x coord
        sy = Math.floor(i / sr) * (segment[1] * (cellSize[1]+padding[1]) + padding[1]); // segment y coord

    for (var j = 0; j < sc; j++) {
      if (i*sc+j >= data.length) {
        break;
      }

      data[i*sc+j].index = i*sc+j;
      data[i*sc+j].x = sx + (j % segment[0]) * (cellSize[0]+padding[0]);
      data[i*sc+j].y = sy + Math.floor(j / segment[0]) * (cellSize[1]+padding[1]); 
    }
  }

  return data;
}

module.exports = waffle;
