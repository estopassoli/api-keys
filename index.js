const express = require('express')
const app = express();
const fs = require('fs');
const path = require('path')
const bodyParser = require('body-parser');
require('dotenv').config()
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')
const apikey = process.env.APIKEY;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('App listening on http://localhost:3000');
});


app.get('/getkey', (req, res) => {
    const keys = JSON.parse(fs.readFileSync('./keys.json', 'utf8'));
    const key = keys[req.query.key];
    if (key) {
        res.send(key);
    } else {
        res.send('Key not found');
    }
});
app.get('/newkey', (req, res) => {
    if (req.query.apikey == apikey) {
        var keys = JSON.parse(fs.readFileSync('./keys.json', 'utf8'));
        //generate a new key with 12 characters
        var newkey = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 22; i++)
            newkey += possible.charAt(Math.floor(Math.random() * possible.length));
        //check if the key already exists
        if (keys.hasOwnProperty(newkey)) {
            res.send("Key already exists");
        } else {
            keys[newkey] = {
                "value": newkey,
                "valid": true,
                "initialDate": new Date().toLocaleString(),
                "expireDate": new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)).toLocaleString()
            };
            fs.writeFileSync('./keys.json', JSON.stringify(keys, null, 2));
            res.json(keys[newkey]);
        }
    } else {
        res.send('Wrong API key');
    }
})