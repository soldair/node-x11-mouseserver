var http = require('http')
var shoe = require('shoe')
var ecstatic = require('ecstatic')(__dirname + '/static');
var dnode = require('dnode');


var server = http.createServer(ecstatic);
server.listen(9999,function(){
  console.log(server.address())
});

var sock = shoe(function (stream) {
    var iv = setInterval(function () {
        stream.write(Math.floor(Math.random() * 2));
    }, 250);

    stream.on('end', function () {
        clearInterval(iv);
    });

    stream.pipe(process.stdout, { end : false });
});
sock.install(server, '/invert');


var dsock = shoe(function (stream) {
    var d = dnode({
        transform : function (s, cb) {
            var res = s.replace(/[aeiou]{2,}/, 'oo').toUpperCase();
            cb(res);
        },
        log:function(data){
          console.log.apply(console,arguments);
        }
    });
    d.pipe(stream).pipe(d);
});

dsock.install(server, '/dnode');
