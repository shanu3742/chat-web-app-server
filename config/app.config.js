const APP_CONFIG ={
    PORT:process.env.PORT||5000,
    CLIENT_URL:process.env.CLIENT_URL,
    LOGIN_WINDOW_DURATION:10 * 60 * 1000,
    LOGIN_MAX_ATTEMPTS:5,
    LOGIN_RATE_LIMIT_MESSAGE:'Too many login attempts. Please try again after 10 minutes.'

}
module.exports = {APP_CONFIG}