require('dotenv').config();  

const { createClient } = require('@supabase/supabase-js');
console.log("URL:", process.env.SUPABASE_URL); 

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


console.log("Supabase Connected");

module.exports = supabase;