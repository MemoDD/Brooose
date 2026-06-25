const fs = require("fs");
const path = require("path");

const filePath=(__dirname,"productsList.csv");
const writeP=fs.createWriteStream(filePath);
writeP.write("Product Id,name, category,price, updated_at, created_at time\n");

// methods to generate all fields
function pid(min,max){
   return Math.floor(Math.random()*(max-min+1)+min);
}
function name(){
    let abc = "abcdefghijklmnoprstuv";
    let name="";
    for(let i=0;i<8;i++){
        const rAlpha=Math.floor(Math.random()*abc.length);//random alphabet index
        name+=abc[rAlpha];
    }
    return name;
}
function category(){
    let cat = ["Fashion","Mobile","Beauty","Electronics","Appliances","Toys","Gadgets","Books","Sports&Fitness"];
    const rcat=Math.floor(Math.random()*cat.length);
    return cat[rcat];
}
function price(min,max){
const p= Math.random()*(max-min)+min;
return parseFloat(p.toFixed(2));
}
function randomDate() {
    const start = new Date(2015, 0, 1); 
    const end = new Date();
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString().slice(0, 19).replace("T", " ");
}
for(let i=1;i<=200000;i++){
    const row=[pid(1,200000),name(),category(),price(100,100000),
        randomDate(),randomDate()
    ].join(" , ")+"\n";
    writeP.write(row);
}
writeP.end(() => {
    console.log(` CSV file created at: ${filePath}`);
});