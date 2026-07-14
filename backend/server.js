const db = require("./config/db")
const express = require("express")
const dotenv = require("dotenv")
const app = express()
const cors = require('cors');
dotenv.config()

app.use(cors({ origin: '*' }));
app.use(express.json())

app.use("/api/v1/jobs", require("./v1/routes/job_route"))

const PORT = process.env.PORT

async function startServer() {
    try {

        const [result] = await db.query("SELECT 1")
        if (result) {
            app.listen(PORT, function () {
                console.log(`Server Is Running On ${PORT}..`)
            })
        }
    } catch (err) {
        console.log("Database Not Connected..")
        console.log(err)
    }

}
startServer()