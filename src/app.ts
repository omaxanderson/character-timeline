import express from 'express';
import morgan from 'morgan';
import BodyParser from 'body-parser';
import uiRoutes from './routes/uiRoutes';
import characterRoutes from './routes/character';
import seriesRoutes from './routes/series';
import noteRoutes from './routes/note';
import searchRoutes from './routes/search';
import db from './database/db';

const app = express();
const bodyParser = BodyParser.json();

type Request = express.Request;
type Response = express.Response;

// Template engine
app.set('views', './src/ui/views');
app.set('view engine', 'pug');

// Logging
app.use(morgan('dev'));

// Routes
app.use('/', uiRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/note', noteRoutes);


// Start the server
(async () => {
   const port = 3000;
   const address = '127.0.0.1';
   await app.listen(port, address);
   console.log(`Listening at ${address}/${port}`);
})();
