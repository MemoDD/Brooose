const express = require("express");
const cors = require("cors");


const db = require("./db");
const table = require("./createTable");

const app = express();
app.use(cors());
const path = require("path");

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for root path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "front.html"));
});


// Products with pagination, filter, indexing, and snapshot
app.get("/products", (req, res) => {
    let { cursor, limit, category, startDate, snapshotTime } = req.query;

    // Default limit
    limit = parseInt(limit) || 20;

    // If no snapshotTime provided (first page), set it to now
    if (!snapshotTime) {
        snapshotTime = new Date().toISOString();
    }

    // Base query: only include products created before or at snapshotTime
    let sql = "SELECT * FROM products WHERE created_at <= ?";
    const params = [snapshotTime];

    // Cursor pagination: fetch rows after last seen pid
    if (cursor) {
        sql += " AND pid > ?";
        params.push(parseInt(cursor));
    }

    // Filter by category
    if (category) {
        sql += " AND category = ?";
        params.push(category);
    }

    // Optional filter by start date (but still respect snapshotTime)
    if (startDate) {
        sql += " AND created_at >= ?";
        params.push(startDate);
    }

    // Order by pid ASC for stable pagination
    sql += " ORDER BY pid ASC";

    // Limit results
    sql += " LIMIT ?";
    params.push(limit);

    // Execute query
    db.query(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Determine next cursor
        let nextCursor = null;
        if (rows.length > 0) {
            nextCursor = rows[rows.length - 1].pid;
        }

        // Send products + next cursor + snapshotTime
        res.json({
            products: rows,
            nextCursor: nextCursor,
            snapshotTime: snapshotTime // client must send this back for next page
        });
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("My API running at http://localhost:3000");
});
