require('dotenv').config();
const express = require('express');

const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use('/api/roles', require('./routes/Roles'));
app.use('/api/brand', require('./routes/Brand'));
app.use('/api/provieder', require('./routes/Provieder'));
app.use('/api/storages', require('./routes/storages'));

app.use('/',require('./public/controller'));

app.use(express.static(path.join(__dirname, 'public')));
//

//app.get('/{*path}', (req, res) => {
//    res.sendFile(path.join(__dirname,'public', 'index.html'));
//});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})