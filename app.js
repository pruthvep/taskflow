require('dotenv').config(); 
const express = require('express');
const app = express();

const jobQueue = require('./queue');   // 👈 ADD THIS LINE

const { v4: uuidv4 } = require('uuid');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('TaskFlow is running');
});


app.post('/job', async (req, res) => {
  const { type, payload } = req.body;
  console.log("entered into the post")
  const jobId = uuidv4();

  const job = await jobQueue.add(type,{payload, jobId}  ,{
    jobId,  
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  });

  console.log('After queue');

  res.send('Job added to queue');
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});