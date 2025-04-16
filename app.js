import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { blogShit } from './controllers/blogControllers.js'; 
import { userRoutes } from './controllers/userControllers.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboardcatRidesAgain123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/blogPostsDB',
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    }
}));


app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

blogShit(app);
userRoutes(app);

app.listen(port, () => {
    console.log("Server is running at http://localhost:3000");
});
