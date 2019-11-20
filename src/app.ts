import express from 'express';
import morgan from 'morgan';
const app = express();

// Template engine
app.set('views', './src/ui/views');
app.set('view engine', 'pug');

// Logging
app.use(morgan('dev'));

// Routes
app.get('/pug', (req, res) => {
   res.render('test');
});
app.get('/max', (req, res) => {
   res.render('max');
});

// Start the server
(async () => {
   const port = 3000;
   const address = '127.0.0.1';
   await app.listen(port, address);
   console.log(`Listening at ${address}/${port}`);
})();
