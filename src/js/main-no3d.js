var d3                = require('d3'),
    gsap              = require('gsap'),
    ModifiersPlugin   = require('../../node_modules/gsap/src/uncompressed/plugins/ModifiersPlugin.js'),
    ColorPropsPlugin  = require('../../node_modules/gsap/src/uncompressed/plugins/ColorPropsPlugin.js'),
    chance            = require('chance'),
    timelineControl   = require('./timeline-control.js'),
    waffle            = require('./waffle.js');

var scene = d3.select('#screen')
              .append('svg')
              .attr('width', 1280)
              .attr('height', 720),
    tl = new gsap.TimelineMax({ useFrames: true, paused: true, autoCSS: false }),
    tlc = timelineControl.gsapTimelineControl(tl)
                         .screen(d3.select('#screen')),
    ch = new chance.Chance(320);

d3.select('#timeline')
  .call(tlc);

var gas = function(i) {
  return i < 7808 ? 'n' :
          i >= 7808 && i < 7808+2095 ? 'o' :
          i >= 7808+2095 && i < 7808+2095+93 ? 'ar' :
          'co2';
};

var cells = ch.shuffle(waffle(d3.range(100*100).map(function() { return {}; }), {
              cellSize: [5, 5],
              padding: 1,
              segment: 10,
              width: 100
            }));

scene.append('g')
      .attr('transform', 'translate(100,100)')
      .selectAll('.block')
      .data(cells)
      .enter()
        .append('rect')
        .attr('class', function(d, i) { return 'block gas-' + gas(i); })
        .attr('x', function(d) { return d.x; })
        .attr('y', function(d) { return d.y; })
        .attr('width', 5)
        .attr('height', 5);

var ws = scene.selectAll('.block'); // select separately because the above code is an enter selection and won't work.

tl.staggerFrom(ws.nodes(), 120, { attr:{ x:-50, y:-50, width:0, height:0 } }, 0.01);

tlc.updateFromGsapTimeline(false);   

/*
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



console.log('loaded', new Date(Date.now()));
*/