const express = require('express')
app = express()
app.use(express.json({ extended: false }));
const cors = require('cors');

//app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
// Define Routes
app.use('/api/queryPatient', require('./routes/api/queryPatient'));
const PORT  = process.env.PORT || 5000;
app.listen(PORT, ()=>{console.log(`server listen on port ${PORT}`)});