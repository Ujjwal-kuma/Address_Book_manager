let mongoose = require('mongoose');
let express = require('express');
let swal = require('sweetalert'); 
let ejs = require('ejs');
let app = express();
app.set('view engine', 'ejs');
let path = require('path');
let currentPath = path.join(__dirname, 'views');
let userSchema = require('./userSchema');
let user = mongoose.model('Contact', userSchema);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const fileUpload = require('express-fileupload');
app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);


let contacts = [];
app.get('/', async (req, res) => {
    let datas = await user.find();
    for (let i = 0; i < datas.length; i++) {
        contacts.push({
            name: datas[i].name,
            phone: datas[i].phone,
            id: datas[i]._id,
            image: datas[i].image
        })
    }
    res.render('contact', { data: datas });
    contacts = [];
})

app.post('/add', async (req, res) => {
    contacts = [];
    try {
        const { image } = req.files;
        console.log(image);
        if (!image) return res.sendStatus(400);
        image.mv(__dirname + '/views/uploads/' + image.name);
        let imagename = `/uploads/${image.name}`;
        let name = req.body.name;
        let phone = req.body.phone;
        let data = await user({ name: name, phone: phone, image: imagename });
        let result = await data.save();
        // contacts.push({
        //     name: req.body.name,
        //     phone: req.body.phone,
        // })
        console.log(result.name, result.phone, result._id);
        res.redirect('/');
        contacts = [];
    } catch (e) {
        console.log(e);
        // res.send("Mobile Number Already Exists");
        swal("Oops!");
        res

    }
})

app.get('/delete/:id', async (req, res) => {
    await user.deleteOne({ _id: req.params.id });
    res.redirect('/')
})

// app.get('/edit/:id',async(req,res)=>{
//     let result = await user.findOne({_id:req.params.id});
//     updateData = {
//         name:result.name,
//         phone:result.phone,
//         id:result._id
//     }
//     res.render('update', {update:updateData})
// })
app.get('/edit/:id', async (req, res) => {
    let result = await user.findOne({ _id: req.params.id });
    updateData = {
        name: result.name,
        phone: result.phone,
        id: result._id,
        image: result.image
    }
    res.render('update', { update: updateData })
})

app.post('/update/:id', async (req, res) => {
    const { image } = req.files;
    if (!image) return res.sendStatus(400);
    image.mv(__dirname + '/views/uploads/' + image.name);
    let imagename = `/uploads/${image.name}`;
    let result = await user.updateOne({ _id: req.params.id }, {name:req.body.name, phone:req.body.phone, image:imagename});
    res.redirect('/');

})


app.listen("3000", (req, res) => {
    console.log("Server listening on 3000");
})