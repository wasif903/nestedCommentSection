import express  from "express";
import mongoDBConnection from "./db.js";
import dotenv from 'dotenv';
import auth from "./routes/auth.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import comments from "./routes/comment.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());
app.use(cookieParser());

dotenv.config();
mongoDBConnection();

app.use('/auth', auth);
app.use('/posting', comments);

app.get('/check', (req, res) => {
    res.send("hello world");
})

app.listen(process.env.PORT , () => console.log(`app listening on port ${process.env.PORT}`));