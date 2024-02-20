const nodemailer = require('nodemailer')
require('dotenv').config();
const express = require('express');
const app = express();
// const bodyParser = require('body-parser')
app.set('view engine', 'ejs');
// app.use(bodyParser.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
// app.use(express.json())
const multer = require('multer');
const { text } = require('body-parser');


const upload = multer({dest: 'files/'})
app.get('/', (req,res) => {
    res.render('index');

});


app.post('/newEmail', upload.single('sender_file'), async (req,res) => {
    
    
        let sender_email = req.body.sender_email;
        let subject = req.body.subject;
        let message_body = req.body.message_body;
        let recipient_email = req.body.recipient_email;
        let sender_file = req.file;
      if(sender_file != undefined){
       
        await sendEmailWithFile(sender_email, recipient_email,subject,message_body,sender_file )
        }else{
           await  sendEmail(sender_email, recipient_email,subject,message_body)
        }
            res.status(200).json({
                status: 'success',
                body: req.body
            });

   
});




const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});


async function sendEmail(_from, _to, _subject, _text) {
   
   
    try {
        
        const info = await transporter.sendMail({
            from: {
                name: _from,
                address: _from
            },
            to: _to, // list of receivers
            subject: _subject, // Subject line
            text: _text, // plain text body
        });
        console.log('Email has been successfully sent')
        console.log("Message sent: %s", info.envelope);


        
    }catch(err){
        console.log(err);
    }
} 
async function sendEmailWithFile(_from, _to, _subject, _text, _file) {
   
   
    try {
        
        const info = await transporter.sendMail({
            from: {
                name: _from,
                address: _from
            },
            to: _to, // list of receivers
            subject: _subject, // Subject line
            text: _text, // plain text body
            attachments: {
                filename: _file.originalname,
                path:_file.path
            }
        });
        console.log('Email has been successfully sent')
        console.log("Message sent: %s", info.messageId);
    }catch(err){
        console.log(err);
    }
} 
  

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on the port ${process.env.PORT}`);
});