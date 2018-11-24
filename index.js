/**
 * Wood Plugin Module.
 * http服务
 * by jlego on 2018-11-18
 */
const cluster = require('cluster');
const http = require('http');
const https = require('https');

module.exports = (app = {}, config = {}) => {
  let httpServer = null,
    httpsServer = null;

  function startServer(){
    if(config.http){
      httpServer = http.createServer(app.application)
        .listen(config.http.port, () => {
          let host = httpServer.address().address;
          let port = httpServer.address().port;
          console.log('http server running at http://' + host + ':' + port);
        }
      );
    }
    if(config.https){
      httpsServer = https.createServer(config.https.options || {}, app.application)
        .listen(config.https.port, () => {
          let host = httpsServer.address().address;
          let port = httpsServer.address().port;
          console.log('https server running at http://' + host + ':' + port);
        }
      );
    }
  }
  const cpuNums = app.config.cluster.cpus <= 0 ? require('os').cpus().length : app.config.cluster.cpus;
  if(app.config.cluster.cpus > 1){
    if (cluster.isMaster) {
      for (let i = 0; i < cpuNums; i++) {
        cluster.fork();
      }
      cluster.on('disconnect', (worker) => {
        console.log(`The worker #${worker.id} has disconnected`);
        worker.kill();
      });
      cluster.on('exit', (worker, code, signal) => {
        console.log('worker %d died (%s). restarting...', worker.process.pid, signal || code);
        cluster.fork();
      });
    } else {
      console.log('The slaver[' + cluster.worker.id + ']');
      startServer();
    }
  }else{
    startServer();
  }
  return app;
}
