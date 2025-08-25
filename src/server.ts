import app from "./app";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get the port from environment variables, with a fallback to 8001
const port = process.env.PORT || 8001;

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(
        `[server]: Server is running at http://localhost:${port} on a today?.`,
    );
});
