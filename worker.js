require('dotenv').config();  
const { Worker, tryCatch } = require('bullmq');

const IORedis = require('ioredis');
const supabase = require('./db');
const connection = new IORedis(
  process.env.REDIS_URL,
  { maxRetriesPerRequest: null }
);

const worker = new Worker(
  'jobs',
  async job => {
    const {jobId} = job.data
    console.log("enterted into the worker")
    const { data: existing } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_id', jobId)
      .single();

    if (existing && existing.status== "completed"){
      console.log('Skipping duplicate job');
      return;
    }

   await supabase
      .from('jobs')
      .upsert({
        job_id: jobId,
        status: 'processing'
       });

    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Processing job:', job.name);
    console.log('Data:', job.data);
    try {

      await new Promise(resolve => setTimeout(resolve, 2000));

      const { data, error } = await supabase
      .from('jobs')
      .upsert({
        job_id: jobId,
        status: 'completed'
        });

      if (error) {
        console.log("Supabase error:", error.message);
      } else {
    console.log("✅Supabase write success");
      }

      console.log('Job completed');
    } catch (error) {
      console.log('job failed')
      await supabase
        .from('jobs')
        .upsert({
          job_id: jobId,
          status: 'failed'
        });
    }


  },
  { connection }
);