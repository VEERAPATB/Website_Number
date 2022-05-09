// Open call Express
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const PoolCluster = require('mysql/lib/PoolCluster');
const { send } = require('express/lib/response');

const app = express();
const port = process.env.port || 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))  

//-------- View ------------//
app.set('view engine','ejs')
//Connect public folder
app.use(express.static('public'))

// MySQL Connect phpMyAdmin
const pool = mysql.createPool({
    connectionLimit : 10,
    connectTimeout : 20,
    host : 'localhost' , // www.google.com/sql or Server IP Address
    user : 'root',
    password : '',
    database : 'lotterys'  // Connect Database from users.sql (Import to phpMyAdmin) 
})

var obj = {} //Global Variables

// Variable Front-End {Port}
app.get('/addnumber',(req, res) => {
    res.render('addnumber')
})
app.get('/check',(req,res)=>{
    res.render('/check')
})

// GET (Insert Info show) | host (Insert website page)
// Get all Data_number.sql 
app.get('',(req,res) =>{
    pool.getConnection((err,connection) =>{    // err = connect (false) , connection = connect (true) 
        if(err) throw err
        console.log("connected id : ?",connection.threadId) // print show connect  true or not 
        
        connection.query('SELECT * FROM apr_1' ,(err,rows) =>{
            connection.release();
            if(!err){
                // Back-End Postman Test --> res.send
                // Front-End : 
                // Package Info show 
                //--------Model of Data--------------//
                obj = { number : rows, Error : err}

                //-----------Controller--------------//
                res.render('index', obj)
            }else{
                console.log(err)
            }
        })
    })
})

//Data Number
// Database 16 March 2022
app.get('/mar_16',(req,res) =>{
    pool.getConnection((err,connection) =>{    // err = connect (false) , connection = connect (true) 
        if(err) throw err
        console.log("connected id : ?",connection.threadId) // print show connect  true or not 
        
        connection.query('SELECT * FROM `mar_16` ORDER BY `mar_16`.`reward` DESC' ,(err,rows) =>{
            connection.release();
            if(!err){
                //--------Model of Data--------------//
                obj = { number : rows, Error : err}

                //-----------Controller--------------//
                res.render('showdata', obj)
            }else{
                console.log(err)
            }
        })
    })
})
// Database 1 April 2022
app.get('/apr_1',(req,res) =>{
    pool.getConnection((err,connection) =>{    // err = connect (false) , connection = connect (true) 
        if(err) throw err
        console.log("connected id : ?",connection.threadId) // print show connect  true or not 
        
        connection.query('SELECT * FROM `apr_1` ORDER BY `apr_1`.`reward` DESC' ,(err,rows) =>{
            connection.release();
            if(!err){
                //--------Model of Data--------------//
                obj = { number : rows, Error : err}

                //-----------Controller--------------//
                res.render('showdata', obj)
            }else{
                console.log(err)
            }
        })
    })
})
// Database 16 April 2022
app.get('/apr_16',(req,res) =>{
    pool.getConnection((err,connection) =>{    // err = connect (false) , connection = connect (true) 
        if(err) throw err
        console.log("connected id : ?",connection.threadId) // print show connect  true or not 
        
        connection.query('SELECT * FROM `apr_16` ORDER BY `apr_16`.`reward` DESC' ,(err,rows) =>{
            connection.release();
            if(!err){
                //--------Model of Data--------------//
                obj = { number : rows, Error : err}

                //-----------Controller--------------//
                res.render('showdata', obj)
            }else{
                console.log(err)
            }
        })
    })
})
// POST (Insert Info --> database)   
app.post('/addnumber',(req, res) => {
    pool.getConnection((err, connection) => { 
        if(err) throw err
            const params = req.bod
                //Check 
                pool.getConnection((err, connection2) => {
                    connection2.query(`SELECT COUNT(no) AS count FROM beers WHERE no = ${params.no}`, (err, rows) => {
                        if(!rows[0].count){
                            connection.query('INSERT INTO apr_1 SET ?', params, (err, rows) => {
                                connection.release()
                                if(!err){
                                    obj = {Error:err, mesg : `Success adding data ${params.number}`}
                                    res.render('addnumber', obj)
                                }else {
                                    console.log(err)
                                }
                                })           
                        } else {
                            obj = {Error:err, mesg : `Can not adding data ${params.number}`}
                            res.render('addnumber', obj)
                            }
                        })
                    })
                })
            })

// Check Number
// Check Number Database 16 March 2022        
app.post('/check',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        const params = req.body
        console.log("connect id : ?",connection.threadId)

        connection.query('SELECT * FROM `mar_16` WHERE `number` LIKE ? ORDER BY `reward` DESC',req.params.number,(err,rows)=>{
            connection.release();
            if(!err){
                obj = {Error : err , mesg : ` Reward ${params.reward} ฿`}
                res.render('check',obj)
            }else{
                console.log(err)
            }
        })
    })
})
// Check Number Database 1 April 2022        
app.post('/apr_1/check',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        const params = req.body
        console.log("connect id : ?",connection.threadId)

        connection.query('SELECT * FROM `apr_1` WHERE `number` LIKE ? ORDER BY `reward` DESC',req.params.number,(req,res)=>{
            connection.release();
            if(!err){
                obj = {Error : err , mesg : ` Reward ${params.reward} ฿`}
                res.render('check.ejs',obj)
            }else{
                console.log(err)
            }
        })
    })
}) 
// Check Number Database 16 April 2022        
app.post('/apr_16/check',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        const params = req.body
        console.log("connect id : ?",connection.threadId)

        connection.query('SELECT * FROM `apr_16` WHERE `number` LIKE ? ORDER BY `reward` DESC',req.params.number,(req,res)=>{
            connection.release();
            if(!err){
                obj = {Error : err , mesg : ` Reward ${params.reward} ฿`}
                res.render('check.ejs',obj)
            }else{
                console.log(err)
            }
        })
    })
})

// API DELETE Info database
// Delete  Database 16 March 2022
app.delete('/mar_16/delete/:number',(req,res) =>{
    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log("Connected id: ?",connection.threadId)
        // Delete data
        connection.query('DELETE FROM `mar_16` WHERE `mar_16`.`number` = ?', [req.params.number],(err,rows) =>{
            connection.release();
            if(!err){
                res.send(`${[req.params.number]} is complete`)
            }else{
                console.log(err)
            }
        })
    })
})
// Delete Data
// Delete  Database 1 April 2022
app.delete('/apr_1/delete/:number',(req,res) =>{
    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log("Connected id: ?",connection.threadId)
        // Delete data
        connection.query('DELETE FROM `apr_1` WHERE `apr_1`.`number` = ?', [req.params.number],(err,rows) =>{
            connection.release();
            if(!err){
                res.send(`${[req.params.number]} is complete`)
            }else{
                console.log(err)
            }
        })
    })
})
// Delete  Database 16 April 2022
app.delete('/apr_16/delete/:number',(req,res) =>{
    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log("Connected id: ?",connection.threadId)
        // Delete data
        connection.query('DELETE FROM apr_16 WHERE `apr_16`.`number` = ?', [apr_16.number],(err,rows) =>{
            connection.release();
            if(!err){
                res.send(`${[req.params.number]} is complete`)
            }else{
                console.log(err)
            }
        })
    })
})

// Information Developer
app.get('/credits',(req,res) =>{
    res.render('credits.ejs')
    })

app.listen(port,() =>
   console.log("listen on port : ? ",port )
)