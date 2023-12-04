import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { fileURLToPath } from 'url';

import config from './app/config/app.config.js';
//User routers
import userRouter from './app/routes/user.route.js';

//Admin routers
import statisticUserRouter from './app/routes/admin/statisticUser.route.js';
import productRouter from './app/routes/product.route.js';
import adminRouter from './app/routes/admin/admin.route.js';
import otpRouter from './app/routes/otp.route.js';
//Shared
import refreshTokenRouter from './app/routes/refreshToken.route.js';
import resetPasswordRouter from './app/routes/resetPassword.route.js';
import googleRouter from './app/routes/google.route.js';
import authRouter from './app/routes/auth.route.js';
import mailRouter from './app/routes/mail.route.js';
import categoryRouter from './app/routes/category.route.js';
import imageRouter from './app/routes/image.route.js';
import cartRouter from './app/routes/cart.route.js';
import orderRouter from './app/routes/order.route.js';
import feedbackRouter from './app/routes/feedback.route.js';
import favoriteRouter from './app/routes/favorite.route.js';
import statistic from './app/routes/statistic.route.js';
import reportRouter from './app/routes/report.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = config.port;
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000/api',
    },
});

app.use(
    cors({
        origin: '*',
        credentials: true, //access-control-allow-credentials:true
        optionSuccessStatus: 200,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//User routes
app.use('/api/user', userRouter);

//Admin routes
app.use('/api/admin', adminRouter);
app.use('/api/admin/statisticUser', statisticUserRouter);
app.use('/api/product', productRouter);

//Shared
app.use('/api/refreshToken', refreshTokenRouter);
app.use('/api/otp', otpRouter);
app.use('/api/password', resetPasswordRouter);
app.use('/api/auth', authRouter);
app.use('/api/auth/google', googleRouter);
app.use('/api/service/mail', mailRouter);
app.use('/api/category', categoryRouter);
app.use('/api/image', imageRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/favorite', favoriteRouter);
app.use('/api/statistic', statistic);
app.use('/api/report', reportRouter);

//handle error
app.use((rep, res, next) => {
    return next(new ApiError(404, 'Resource not found'));
});
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        message: err.message || 'Internal Sever Error',
    });
});

io.on('connection', (socket) => {
    console.log('a user connected');
});
const startApp = () => {
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT} ...`);
    });
};
export default startApp;
