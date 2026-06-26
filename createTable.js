const db = require("./db");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");


const createProductsTable = `
CREATE TABLE IF NOT EXISTS products(
    pid BIGINT PRIMARY KEY,
    name VARCHAR(56), 
    category VARCHAR(15),
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

db.query(createProductsTable, (err) => {
    if (err) {
        console.error("❌ Failed to create table:", err.message);
    } else {
        console.log("✅ Products table created successfully.");
        loadCsvData();
    }
});

// parse
function loadCsvData() {
    const csvFilePath = path.resolve(__dirname, "productsList.csv");
    const batchSize = 1000;
    let batch = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row) => {
            batch.push([
                row.pid,
                row.name,
                row.category,
                row.price,
                row.created_at || null,
                row.updated_at || null
            ]);

            if (batch.length >= batchSize) {
                insertBatch(batch);
                batch = [];
            }
        })
        .on("end", () => {
            if (batch.length > 0) {
                insertBatch(batch);
            }
            console.log(" CSV import complete!");
        });
}


function insertBatch(batch) {
    const sql = `
      INSERT INTO products (pid, name, category, price, created_at, updated_at)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        category = VALUES(category),
        price = VALUES(price),
        updated_at = VALUES(updated_at)
    `;
    db.query(sql, [batch], (err) => {
        if (err) {
            console.error(" Batch insert error:", err.message);
        } else {
            console.log(` Inserted batch of ${batch.length} rows`);
        }
    });
}
