import express, { Express } from 'express';
import path from "path"
import router from "./src/index"
import dotenv from "dotenv"


dotenv.config()

const app: Express = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname,"../public")))
app.use("/",router)


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});