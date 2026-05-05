require('dotenv').config();
const express = require('express');

const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use('/api/asigroles', require('./routes/AsigRoles'));
app.use('/api/brand', require('./routes/Brand'));
app.use('/api/model', require('./routes/Models'));
app.use('/api/credentials', require('./routes/Credentials'));
app.use('/api/loan', require('./routes/Loan'));
app.use('/api/locker', require('./routes/Locker'));
app.use('/api/provieder', require('./routes/Provieder'));
app.use('/api/receipts', require('./routes/Receipts'));
app.use('/api/roles', require('./routes/Roles'));
app.use('/api/storages', require('./routes/Storages'));
app.use('/api/tools', require('./routes/Tools'));
app.use('/api/tool-loans', require('./routes/ToolsLoan'));
app.use('/api/workers', require('./routes/Workers'));

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