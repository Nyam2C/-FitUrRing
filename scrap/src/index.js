import { connectDB } from './db/dbConnect.js';
import processAllQueries from './controllers/searchController.js';

async function start() {
    try {
        await connectDB();
        // Process queries and fetch video data
        await processAllQueries();

        console.log('All queries processed and data saved to DB!');
    } catch (error) {
        console.error('Error during execution:', error);
    }
}

start();
