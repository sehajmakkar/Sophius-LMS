import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import express from "express";

const app = express();

const PORT = process.env.PORT || 8000;

// logging middleware
if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}

// Body Parser Middleware
app.use(express.json({limit: '10kb'})); // req accepting type
app.use(express.urlencoded({extended: true, limit: '10kb'}));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server error",
    ...(process.env.NODE_ENV === "development" && {stack: err.stack})
  })
})


// API Routes



// 404 handler
// it should be always at the bottom
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Resource not found",
  })
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})