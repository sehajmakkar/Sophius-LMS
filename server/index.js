import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from 'express-mongo-sanitize';
import hpp from "hpp";
import cookieParser from "cookie-parser";
import cors from 'cors'

import healthRouter from "./routes/health.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

const PORT = process.env.PORT || 8000;

// Global Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15min
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try later :/"
})

// security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use("/api", limiter);


// logging middleware
if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}

// Body Parser Middleware
app.use(express.json({limit: '10kb'})); // req accepting type
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(cookieParser());

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server error",
    ...(process.env.NODE_ENV === "development" && {stack: err.stack})
  })
})

// CORS config
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Access-Control-Allow-Origin",
    "device-remember-token",
    "Origin"
  ]
}));


// API Routes
app.use("/health", healthRouter);
app.use("/api/v1/user", userRouter);

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