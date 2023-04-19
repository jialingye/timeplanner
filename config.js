const DATABASE_URL= `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@sei.3krmia0.mongodb.net/timeDB?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 3000 ; 
const API = process.env.API_KEY;
const API2 = process.env.AI_API;
const SALT = process.env.SALT_ROUNDS;
const SECRET = process.env.SECRET;

module.exports={DATABASE_URL,PORT,API,API2,SALT,SECRET}