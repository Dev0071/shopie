import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './Routers/userRoutes.js';
import productRouter from './Routers/productRoutes.js';
import cartRouter from './Routers/cartRoutes.js';
import cookieParser from 'cookie-parser';
dotenv.config();
const corsOptions = {
	origin: '*',
};

const app = express();
app.use(cookieParser('SESSION_KEY'));
app.use(cors(corsOptions));
app.use(express.json());




const PORT = 3000;

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);

app.listen(PORT);

export default app;
