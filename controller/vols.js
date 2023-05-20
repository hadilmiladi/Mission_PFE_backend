const express = require('express')
const base = require("../cnxDB")
const router= express.Router()

router.route('/addvol').post((req,res)=>{
    const { from, to ,nv, prix} =req.body
    base.query('INSERT INTO vols (depart, arrivee, num_vol, prix) VALUES ($1,$2,$3,$4) RETURNING *',[from, to ,nv, prix],(err, results)=>{
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