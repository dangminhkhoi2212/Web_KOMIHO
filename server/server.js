import startApp from './app.js';
import startDB from './db.js';
const startServer = async () => {
    try {
        await startDB();
        startApp();
    } catch (error) {
        console.log(`Failed to listen on port ${PORT}`);
        console.log(error);
    }
};
startServer();
