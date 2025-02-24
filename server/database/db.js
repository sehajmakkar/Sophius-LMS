import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000; // 5 seconds

class DatabaseConnection {
  constructor() {
    this.retryCount = 0;
    this.isConnected = false;

    // configure mongoose settings
    mongoose.set("strictQuery", true);

    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
      this.isConnected = true;
    });
    mongoose.connection.on("error", () => {
      console.log("Error connecting to MongoDB");
      this.isConnected = false;
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Disconnected from MongoDB");
      this.isConnected = false;

      // attempt a reconnection
      this.handleDisconnection();

    });

    process.on("SIGTERM", this.handleAppTermination.bind(this));
  }

  async connect() {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
      }
  
      const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000, // 5 seconds
        socketTimeoutMS: 45000,
        family: 4, // IPv4
      };
  
      if (process.env.NODE_ENV === "production") {
        mongoose.set("debug", true);
      }
  
      await mongoose.connect(process.env.MONGO_URI, connectionOptions);
      this.retryCount = 0; // reset as connection is successful
    } catch (error) {
      console.log("Error connecting to MongoDB:", error);
      await this.handleConnectionError();
    }
  }

  async handleConnectionError() {
    if (this.retryCount < MAX_RETRIES) {
      this.retryCount++;
      console.log(
        `Retrying connection to MongoDB (attempt ${this.retryCount} of ${MAX_RETRIES})`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      return this.connect();
    } else {
      console.error("Failed to connect to MongoDB after multiple attempts.");
      process.exit(1);
    }
  }

  async handleDisconnection() {
    if(!this.isConnected) {
      console.log("Reconnecting to MongoDB");
      await this.connect();
    }
  }

  async handleAppTermination(){
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
      process.exit(1);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    }
  }

}


// create a singleton instance
const dbConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection);
export const getConnectionStatus = dbConnection.getConnectionStatus.bind(dbConnection);
