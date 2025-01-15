const { app } = require(".");
const { connectDb } = require("./config/db");

const PORT=5454;
const HOST = '0.0.0.0';
app.listen(PORT,async ()=>{
    await connectDb()
    console.log(`E-commerce API is running at http://${HOST}:${PORT}`);
})