const db = require("./db");
const path = require("path");
const createProductsTable =
`CREATE TABLE IF NOT EXISTS products(
    pid BIGINT PRIMARY KEY,
     name VARCHAR(56), 
     category VARCHAR(15),
     price DECIMAL(10,2),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP 
)`;

db.query((createProductsTable),err=>{
    if(err){
        console.error("Failed to create table.error:",err.message)
    }else{
        console.log("products table created successfully.")
    }
})
const csvFilePath = path.resolve(__dirname, "productsList.csv");

//inserting using seeding load infile
const loadCsv =`
LOAD DATA LOCAL INFILE ?
INTO TABLE products
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(pid,name,category,price,created_at,updated_at);
`;
db.query(loadCsv,[csvFilePath],(err,res)=>{
    if(err){
        console.error("Error:",err.message);
    }
    else{
        console.log("csv file inserted into table successfully.Yes!!!");
    }
})