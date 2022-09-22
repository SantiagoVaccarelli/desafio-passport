import express  from "express";
import morgan from "morgan";
import session from "express-session";
import apiRoutes from "./src/routes/apiRoutes.js";
import MongoStore from "connect-mongo";
import passport from "passport";
import 'dotenv/config'
import './src/db/database.js';
import './src/passport/local.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(session(
    {
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: `mongodb://localhost:27017`,
            ttl: 60 * 10 
            })
    }
));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', 'src/views');
app.set('view engine', 'ejs');

app.use('/', apiRoutes);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);