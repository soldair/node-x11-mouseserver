var shoe = require('shoe');
var through = require('through');
var dnode = require('dnode');

var result = document.getElementById('result');

var stream = shoe('/mouse');

alert(3);

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


});
d.pipe(shoe('/dnode')).pipe(d);


function touchStream(el,remote){
  var s = through(function(data){
    var last = data;
    if(!this.paused) return this.queue(data);
  });


  var start = function(ev){
    console.log('start');
    remote.log('touchstart');
   
    ev.preventDefault();
    return false;
  }, end = function(ev){
    console.log('end');
    remote.log('touchend');
    ev.preventDefault();
    return false;
  }, move = function(ev){
    console.log('move');
    remote.log('touchmove');
    ev.preventDefault();
    return false;
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

window.onerror = function(e){
  alert('error!: '+e+'');
}
