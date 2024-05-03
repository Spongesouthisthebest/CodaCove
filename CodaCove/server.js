const express = require('express');
const fs = require('fs');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
mongoose.connect("mongodb://localhost:27017/CodaCove");
const app = express();
const port = 7272;
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// const imagePath = 'img.jpg';
// const imgBuffer = fs.readFileSync(imagePath);
// const imgContentType = 'img.jpg';
// User schema 

const userData = new mongoose.Schema({
    username: String,
    password: String
})
const user = mongoose.model('user', userData);

// Course Info schema 
const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    professor: String,
    duration: String,
    content: String
});

// Create the Course model
const Course = mongoose.model("Course", courseSchema);


// User auth

app.get('/',(req,res)=>{
    res.sendFile("templates/login.html", { root: __dirname })
})

app.get('/sign-up', (req,res)=>{
    res.sendFile("templates/sign-up.html", { root: __dirname })
})

app.post('/sign', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await user.findOne({ username: username });
        if (existingUser) {
            return res.sendFile("templates/error400.html", { root: __dirname })
        }
        const newUser = new user({ username: username, password: password });
        await newUser.save();
        res.send("User created successfully!");
    } catch (error) {
        console.error(error);
        res.sendFile("templates/error.html", { root: __dirname })
    }
});


app.post('/login', async (req,res)=>{
    try{
        const { username, password } = req.body;
        const existUser = await user.findOne({username:username});
        const existpassword = await user.findOne({password:password});
        if(!existUser || !existpassword){
            res.send("Username or password is incorrect!")
        }else{
            res.redirect("/courses")
        }
    }catch(error){
        console.error(error)
        res.status(401).send("Error logging in...")
    }
})

app.get("/courses", (req,res)=>{
    res.render("courses")
})

app.get('/new', (req,res)=>{
    res.render("new")
})

// Publish Courses

app.post("/publish", async (req, res) => {
    try {
        const { title, description, professor, duration, content } = req.body;
        const newCourse = new Course({
            title: title,
            description: description,
            professor: professor,
            duration: duration,
            content: content
        });
        await newCourse.save();
        res.redirect("/courses"); // Redirect after course is added
    } catch (error) {
        console.log(error);
        res.status(500).send("Error publishing course");
    }
});

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`);
})