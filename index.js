/**
 * Wood Plugin Module.
 * http服务
 * by jlego on 2018-11-18
 */

module.exports = (app, config = {}) => {
  // 返回错误信息
  app.use(function (err, req, res, next) {
    if (err) {
      res.status(err.status || 500);
      if(res.print) {
        res.print(error(err));
      }else{
        res.json(error(err));
      }
      return;
    }
    // else{
    //   res.status(404);
    //   res.print(app.error_code.error_noroute);
    // }
  });

  // 监听服务端口
  if(config.http){
    const http = require('http');
    const httpServer = http.createServer(app.application).listen(
      config.http.port,
      () => {
        let host = httpServer.address().address;
        let port = httpServer.address().port;
        console.log('http server running at http://' + host + ':' + port);
      }
    );
  }
  if(config.https){
   const https = require('https');
    const httpsServer = https.createServer(config.https.options || {}, app.application).listen(
      config.https.port,
      () => {
        let host = httpsServer.address().address;
        let port = httpsServer.address().port;
        console.log('https server running at http://' + host + ':' + port);
      }
    );
  }
  return app;
}
