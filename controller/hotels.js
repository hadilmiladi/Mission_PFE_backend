const express = require('express')
const base = require("../cnxDB")
const router=express.Router()

router.route('/addhotelreservation').post((req,res)=>{
    const {name, from, to , prix} =req.body
    base.query('INSERT INTO vols (nom_hotel, de, jusqua, prix) VALUES ($1,$2,$3,$4) RETURNING *',[name, from, to , prix],(err, results)=>{
        if (err){
            throw err
        }
        res.status(201).send("vols added")
    } )
})

/*const find=(req,res)=>{
    base.query('SELECT * FROM vols ',(err,results)=>{
        if (err){
            throw err
        }
        res.status(200).json(results.rows)
    })
}*/
module.exports=router