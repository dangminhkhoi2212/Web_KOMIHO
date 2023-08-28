import mongoose from 'mongoose';
import dbconfig from './app/config/db.config.js';

const URL_DB = dbconfig.url;

const startDB = async () => {
    try {
        await mongoose.set({ strictQuery: true }).connect(URL_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to database ${URL_DB}`);
    } catch (error) {
        console.log(error);
    }
};
export default startDB;
