const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const sequelize = require("./config/db")
const path = require("path")
require("dotenv").config() // Charger les variables d'environnement

const app = express()

// Configuration CORS
app.use(
    cors({
        origin: "http://localhost:4173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
)

app.use(bodyParser.json())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api", require("./routes/routes"))

sequelize
    .sync()
    .then(() => {
        app.listen(5000, () => {
            console.log("Server running on http://localhost:5000")
        })
    })
    .catch((err) => {
        console.error("Error syncing the database:", err)
    })

