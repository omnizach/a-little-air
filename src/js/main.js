var d3                = require('d3'),
    gsap              = require('gsap'),
    ModifiersPlugin   = require('../../node_modules/gsap/src/uncompressed/plugins/ModifiersPlugin.js'),
    ColorPropsPlugin  = require('../../node_modules/gsap/src/uncompressed/plugins/ColorPropsPlugin.js'),
    chance            = require('chance'),
    timelineControl   = require('./timeline-control.js'),
    pixelPerfectScene = require('./pixel-perfect-scene.js'),
    tileMesh          = require('./tile-mesh.js'),
    waffle            = require('./waffle.js');

var tl = new gsap.TimelineMax({ useFrames: true, paused: true, autoCSS: false }),
    tlc = timelineControl.gsapTimelineControl(tl)
                         .screen(d3.select('#screen')),
    scene = pixelPerfectScene(d3.select('#screen').node()),
    ch = new chance.Chance(320);

d3.select('#timeline')
  .call(tlc);

gsap.TweenMax.ticker.addEventListener('tick', scene.render);

var gas = function(i) {
  return i < 7808 ? 'n' :
          i >= 7808 && i < 7808+2095 ? 'o' :
          i >= 7808+2095 && i < 7808+2095+93 ? 'ar' :
          'co2';
};

// n: hsl(200, 100, 75)
// o: hsl(0, 100, 75)
// ar: hsl(260, 100, 75)
// co2: hsl(0, 0, 50)

var gasColor = d3.scaleOrdinal()
                 .domain(['n', 'o', 'ar', 'co2'])
                 .range([0x7fd4ff, 0xff7f7f, 0xa97fff, 0x7f7f7f]);

var gasFilter = function(gas) {
  switch(gas) {
    case 'n':   return function(d, i) { return i <  7808; };
    case 'o':   return function(d, i) { return i >= 7808 && i < 7808+2095; };
    case 'ar':  return function(d, i) { return i >= 7808+2095 && i < 7808+2095+93; };
    case 'co2': return function(d, i) { return i >= 7808+2095+93; };
  }
};

var tm = new tileMesh();
tm.translateX(-300);
tm.translateY(-300);
tm.updateMatrixWorld();
scene.add(tm);

ch.shuffle(
  waffle(d3.range(100*100).map(function() { return {}; }), {
          cellSize: [5, 5],
          padding: 1,
          segment: 10,
          width: 100
        })).forEach(function(d, i) {
          tm.addTile([[d.x, d.y], [5, 5]]);
          tm.tiles[tm.tiles.length-1].color = gasColor(gas(i));
        });

tl.staggerFrom(tm.tiles.filter(gasFilter('n')), 120, { x:-200, y:300, width:0, height:0, }, 0.01);

tl.staggerTo(tm.tiles.filter(gasFilter('n')), 30, { 
  colorProps: { color: 0x404040, format:'number' }
}, 0.01, '-=30');

tl.staggerFrom(tm.tiles.filter(gasFilter('o')), 120, { x:-200, y:300, width:0, height:0 }, 0.1, '+=20');

tl.to(tm.tiles.filter(gasFilter('o')), 30, { 
  colorProps: { color: 0x404040, format:'number' }
}, '-=30');

tl.staggerFrom(tm.tiles.filter(gasFilter('ar')), 120, { x:-200, y:300, width:0, height:0 }, 1, '+=20');
tl.to(tm.tiles.filter(gasFilter('ar')), 30, { 
  colorProps: { color: 0x404040, format:'number' }
}, '-=30');

tl.staggerFrom(tm.tiles.filter(gasFilter('co2')), 120, { x:-200, y:300, width:0, height:0 }, 30, '+=20');

tlc.updateFromGsapTimeline(false);   

console.log('loaded', new Date(Date.now()));
