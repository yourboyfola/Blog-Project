import express from 'express';
import { blogShit } from './controllers/blogControllers.js';

const app = express();
const port = 3000;

app.use(express.json());

app.set('view engine', 'ejs');

app.use(express.static('public'));

blogShit(app);

app.listen(port, () => {
    console.log("Server is running at http://localhost:3000");
});
