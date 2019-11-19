import fastify from 'fastify';
import pug from 'pug';
import pov from 'point-of-view';

const f = fastify({
   logger: {
      prettyPrint: true,
   },
});

f.register(pov, {
   engine: {
      pug,
   },
   templates: './src/ui/views',
   options: {
      views: './src/ui/views',
   },
});

f.get('/pug', (req, res) => {
   res.view('test.pug');
});

f.get('/ping', (request, reply) => {
   reply.code(200).send({ pong: 'it worked!' });
});

(async () => {
   const port = 3000;
   const address = '127.0.0.1';
   await f.listen(port, address);
   f.log.info(`Listening at ${address}/${port}`);
})();
