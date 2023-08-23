import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './Routers/userRoutes.js';
import productRouter from './Routers/productRoutes.js';
import cartRouter from './Routers/cartRoutes.js';

dotenv.config();
const corsOptions = {
	origin: '*',
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(
	session({
		secret: process.env.SESSION_KEY,
		resave: false,
		saveUninitialized: true,
	}),
);

const PORT = 3000;

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);

app.listen(PORT);

export default app;
