const express = require('express');
const router= express.Router()
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'testuser',
  host: 'localhost',
  database: 'testdb',
  password: '123456',
  port: 5432,
})

router.post('/', 
    async (req, res)=>{
        const info = JSON.parse(req.body.info);
        const given = info['given'];
        const needed = info['needed'];
        pool.query("SELECT nsclc_stg FROM nsclc_stg where subject='QMO001-0002'", (error, results) => {
            if (error) {
              throw error
            }
            res.status(200).json(results.rows)
          })
})

router.post('/columns',async (req, res)=>{
    const info = req.body.info;
    pool.query("select column_name from INFORMATION_SCHEMA.COLUMNS where table_name = 'nsclc_stg'",
    (error, result)=>{
        if(error){throw error;}
        res.status(200).json(result.rows);
    });
})

module.exports = router;