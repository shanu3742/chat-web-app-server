const express = require('express');
const https = require('http')
const {Server} =  require('socket.io');
const cors = require('cors');
const dotEnv = require('dotenv');
const mongoose = require('mongoose')
dotEnv.config()
const app = express();
const authRoutes = require('./routes/auth.routes');
const { DB_CONFIG } = require('./config/db.config');
const { limiter } = require('./rateLimiter');
const { headerModifier } = require('./middleware/requestHeaders.middleware');
const { APP_CONFIG } = require('./config/app.config');



//secure cors configuration 
app.use(headerModifier);
app.use('/chat/api/v1',limiter);

app.use(cors());
//add middleware 
app.use(express.json());

mongoose.connect(DB_CONFIG.URL);
const db = mongoose.connection;

db.on('error',() =>{
  console.log(`Error On Connecting To Db`)
})
db.once('open',() => {
  console.log(`Connect To Database`)
})

const server = https.createServer(app);
const io = new Server(server, {
    cors: {
      origin: APP_CONFIG.CLIENT_URL, // Frontend URL
      methods: ["GET", "POST"]
    }
  });

  // Handle socket events
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

})


//all routes
app.use('/chat/api/v1/user',authRoutes)

const PORT = APP_CONFIG.PORT;
server.listen(PORT, () => {
  console.log(DB_CONFIG)
  console.log(`Server running on port ${PORT}`)
});

  
