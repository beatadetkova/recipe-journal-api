const express = require('express');
const app = express();
const cors = require('cors');
const folders = require('./folders');

app.use(cors());

//setting the port.
app.set('port', process.env.PORT || 3000);

app.get('/folders',(req, res) => {
 res.json(folders);
});

//Binding to localhost://3000
app.listen(3000,() => {
 console.log('Express server started at port 3000');
});