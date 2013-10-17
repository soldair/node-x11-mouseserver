var shoe = require('shoe');
var through = require('through');
var dnode = require('dnode');

var result = document.getElementById('result');

var stream = shoe('/mouse');


var s = through(function (msg) {

  // msgs are real mouse position
  console.log('mouse',msg);

  result.appendChild(document.createTextNode(msg));
  this.queue(String(Number(msg)^1));
})


stream.pipe(s).pipe(stream);

var d = dnode();
var dnodeResult = document.getElementById('dresult');

d.on('remote', function (remote) {
  remote.transform('beep', function (s) {
    dnodeResult.textContent = 'beep => ' + s;
  });

  remote.log('touch support',"ontouchend" in document);
  var touchel = document.getElementById('touch')
  var ts = touchStream(touchel,remote);


  document.body.on('mousemove',function(){
    remote.log('mousemove!');
  });

});
d.pipe(shoe('/dnode')).pipe(d);


function touchStream(el,remote){
  var s = through(function(data){
    var last = data;
    if(!this.paused) return this.queue(data);
  });


  var start = function(ev){
    remote.log('touchstart',arguments);
  }, end = function(ev){
    remote.log('touchend',arguments);
  }, move = function(ev){
    remote.log('touchmove',arguments);
  };

  remote.log('binding touch events');
  el.addEventListener('touchstart',start,false);
  el.addEventListener('touchend',end,false);
  el.addEventListener('touchmove',move,false);

  s.on('end',function(){
    el.removeEventListener('touchstart',start);
    el.removeEventListener('touchend',end);
    el.removeEventListener('touchmove',move);
  })

  return s;

}


