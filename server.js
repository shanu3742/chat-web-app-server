const express = require("express");
const https = require("http");
const { Server } = require("socket.io");
//restricted user to post any mongodb operator
const sanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");
const helmet = require("helmet");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
dotEnv.config();
const app = express();
const authRoutes = require("./routes/auth.routes");
const otpRoutes = require("./routes/otp.routes");
const { DB_CONFIG } = require("./config/db.config");
const { limiter } = require("./rateLimiter");
const { headerModifier } = require("./middleware/requestHeaders.middleware");
const { APP_CONFIG } = require("./config/app.config");
const {
  sanitizeInput,
} = require("./middleware/requestSanitization.middleware");
const { errorHandler } = require("./middleware/errorHandler.middleware");
const RedisClient = require("./radish");

//secure cors configuration
app.use(headerModifier);
app.use(sanitizeInput);
//helemet is used to set various http headers to help us to secure   the app (xss cross site scripting clickjacking, csp content security policy)
app.use(helmet());
//more about hpp at - https://www.npmjs.com/package/hpp
app.use(hpp()); //HPP puts array parameters in req.query and/or req.body aside and just selects the last parameter value.
app.use(sanitize());
//limiter is used for dos (Denial of service ) and for brute force attack(multipule login try)
app.use("/chat/api/v1", limiter);
app.use(cors());
//add middleware
//used to parse incoming form dta and extend true is used to parse the nested form data
app.use(express.urlencoded({ extended: true }));
//used to parse json data only upto 10kb user can send at a time
app.use(express.json({ limit: "10kb" }));

mongoose.connect(DB_CONFIG.URL);
const db = mongoose.connection;

db.on("error", () => {
  console.log(`Error On Connecting To Db`);
});
db.once("open", () => {
  console.log(`Connect To Database`);
});

const server = https.createServer(app);
const io = new Server(server, {
  cors: {
    origin: APP_CONFIG.CLIENT_URL, // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Handle socket events
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
});

//all routes
app.use("/chat/api/v1/user", authRoutes);
app.use("/chat/api/v1/user", otpRoutes);
/**
 * error handlimg
 */
app.use(errorHandler);

const PORT = APP_CONFIG.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
