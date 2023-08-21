import express from 'express';
import userRouter from './Routers/userRoutes.js';
import productRouter from './Routers/productRoutes.js'

const app = express();
app.use(express.json());


const PORT = 3000;

app.use('/api/user',userRouter)
app.use('/api/product',productRouter)


app.listen(PORT)


export default app;