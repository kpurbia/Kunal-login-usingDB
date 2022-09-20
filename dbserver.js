const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

//Initial details for database connection
const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'password1234',
    database : 'credentials'
});

//Connecting server with database
connection.connect((err)=>{
    if(err){
        throw err;
    } else {
        console.log("Connected with database");
    }
})

//Function for inserting data
function addRow(data) {
    let insertQuery = 'INSERT INTO employees (??,??,??,??) VALUES (?,?,?,?)';
    let insertData = mysql.format(insertQuery,["name","email","password1","password2",data.name,data.email,data.password1,data.password2]);
    // console.log(insertData);
    connection.query(insertData,(err) => {
        if(err) {
            throw err;
        } else {
            console.log("User registered successfully");
        }
    });
}

//Initializing express
const app = express();

//Middleware configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Configure static middleware for getting static html css and js files
app.use(express.static("public"));

//HTTP Request Handling Mapping
app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/home', (req, res)=>{
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/register', (req, res)=>{
    res.sendFile(__dirname + "/public/register.html")
})

app.get('/login', (req, res)=>{
    res.sendFile(__dirname + "/public/login.html")
})

app.get('/about', (req, res)=>{
    res.sendFile(__dirname + "/public/about.html")
})

app.get('/contact', (req, res)=>{
    res.sendFile(__dirname + "/public/contact.html")
})

app.get('/welcome', (req, res)=>{
    res.sendFile(__dirname + "/public/welcome.html")
})


//Setting APIs for Register
app.post("/api/register", (req, res)=>{
    let userInfo = req.body;
    if(userInfo.password1 === userInfo.password2){
        addRow(userInfo);
        res.redirect("/welcome");
    } else{
        res.send("Passowrd not matched reload homepage again.");
    }
})


//Setting APIs for Login
app.post("/login", (req, res)=>{
    let userInfo = req.body;
    //let loginInfo = {};
    checkData(userInfo);

    //For checking data and login
    function checkData(data){
        let searchQuery = 'SELECT * FROM employees WHERE email = ? AND password1 = ?';
        let searchData = mysql.format(searchQuery, [data.email, data.password]);
        // console.log(searchData);
        connection.query(searchData, (err, result)=>{
            if(err){
                throw err;
            } else{
                if(result.length == 1){
                    res.redirect("/welcome");
                    console.log("Login successful");
                } else{
                    res.redirect("/register");
                    console.log("User not found, please register");
                }
            }
        })
    }
})

//Server Listening
app.listen(7000, ()=>{
    console.log("Express webserver is listening on port 7000");
})