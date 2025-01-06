import express, { Express } from 'express';

const app: Express = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});