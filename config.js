const DATABASE_URL= `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@sei.3krmia0.mongodb.net/timeDB?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 3000 ; 
const API = process.env.API_KEY;

module.exports={DATABASE_URL,PORT,API}