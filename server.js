const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const useragent = require("useragent");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.static("."));
app.use(bodyParser.json());

// DATABASE
if (!fs.existsSync("visitors.db")) fs.writeFileSync("visitors.db", "");

const db = new sqlite3.Database("visitors.db");

db.run(`CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    ip TEXT,
    user_agent TEXT,
    browser TEXT,
    operating_system TEXT,
    country TEXT,
    city TEXT,
    latitude REAL,
    longitude REAL,
    user_type TEXT DEFAULT 'guest',
    name TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// 🌍 Hent geolokasjon etter IP-adresse
async function getGeo(ip) {
    try {
        const res = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await res.json();

        return {
            country: data.country_name || null,
            city: data.city || null,
            lat: data.latitude || null,
            lon: data.longitude || null
        };
    } catch {
        return { country: null, city: null, lat: null, lon: null };
    }
}

// 🟦 AUTOMATISK LOGGING
app.post("/auto-log", async (req, res) => {
    const ua = useragent.parse(req.headers["user-agent"]);
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const session = req.headers["session-id"];

    const geo = await getGeo(ip);

    db.run(
        `INSERT INTO visitors 
        (session_id, ip, user_agent, browser, operating_system, country, city, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            session,
            ip,
            req.headers["user-agent"],
            ua.family,
            ua.os.family,
            geo.country,
            geo.city,
            geo.lat,
            geo.lon
        ],
        () => res.end()
    );
});

// 🟩 LAGRE NAVN
app.post("/name-log", (req, res) => {
    const name = req.body.name || null;
    const session = req.headers["session-id"];

    db.run(
        `UPDATE visitors 
         SET name = ?
         WHERE session_id = ?
         ORDER BY id DESC 
         LIMIT 1`,
         [name, session],
         () => res.json({ ok: true })
    );
});

// 🟨 HENT LOGGEN TIL NETTSIDEN
app.get("/get-log", (req, res) => {
    db.all(`SELECT * FROM visitors ORDER BY id DESC`, (err, rows) => {
        res.json(rows);
    });
});

app.listen(port, () =>
    console.log("Server kjører på http://localhost:" + port)
);
