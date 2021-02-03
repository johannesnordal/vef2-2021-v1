import express from 'express';
import {
  renderHomePage,
  renderVideoPage,
  secondsToMinutesSeconds,
  timeElapsed,
} from './src/videos.js';

const app = express();

app.locals.importantize = (str) => `${str}`;
app.locals.secToMinSec = secondsToMinutesSeconds;
app.locals.timeElapsed = timeElapsed;

const viewsPath = new URL('./views', import.meta.url).pathname;

app.set('views', viewsPath);
app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/:id', (req, res) => {
  renderVideoPage(req, res);
});

app.get('/', (req, res) => {
  renderHomePage(req, res);
});

const hostname = '127.0.0.1';
const port = 5000;

app.listen(port, hostname, () => {
  console.log(`Server running ${hostname}:${port}`);
});
