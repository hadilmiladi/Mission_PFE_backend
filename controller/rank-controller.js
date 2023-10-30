const db = require('../models');


// ** desc   create rank
// ** route  POST api/rank/create
// ** access private
// ** role   admin
const createNewRank = async(req, res) => {
    try {
        // attributs
        const { name, permission, perdiem } = req.body;
         //check name already used
         const checkName = await db.rank.findOne({ where: { name:String(name) } });
         if (checkName) {
             return res.status(409).json({ code: "name" })
         }
        // create
        const newRank = await db.rank.create({
            name,
            permission,
            perdiem
        });
        //failed to create for some reason
        if (!newRank) {
            return res.status(400).json({ error: "failed to create" })
        }
        // ==>
        return res.status(201).json({ message: "created successfully" })
    } catch (error) {
        //server error 
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   delete rank
// ** route  DELETE api/rank/delete/:id
// ** access private
// ** role   admin
const deleteOneRank = async(req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // check rank is being uqed by an other employee
        const checkRank = await db.employee.findAll({
            where:{
                rankId:id
            }});
        console.log('check',checkRank.length)
        if (checkRank.length!==0) {
            return res.status(409).json({ error: "already used" })
        }
        // create
        const deleteRank = await db.rank.destroy({
            where: { id }
        });
        if (!deleteRank) {
            return res.status(400).json({ error: "failed to delete" })
        }
        // ==>
        return res.status(202).json({ message: "deleted successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   update rank
// ** route  PUT api/rank/update/:id
// ** access private
// ** role   admin
const updateOneRank = async(req, res) => {
    try {
        // attributs
        const { id } = req.params;
        const { name, permission, perdiem } = req.body;
        const checkName = await db.rank.findOne({ where: { name:String(name) } });
        if (checkName) {
            return res.status(409).json({ code: "name" })
        }
        // update
        const updateRank = await db.rank.update({ name, permission, perdiem }, { where: { id } });
        if (!updateRank) {
            return res.status(400).json({ error: "failed to update" })
        }
        // ==>
        return res.status(202).json({ message: "updated successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

/* // ** desc   find one rank
// ** route  GET api/rank/one/:id
// ** access private
// ** role   admin
const retriveOneRank = async(req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // retrive
        const item = await db.rank.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: "item doesnt exist" })
        }
        // ==>
        return res.status(200).json({ item })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
} */

// ** desc   find one rank
// ** route  GET api/rank/all
// ** access private
// ** role   admin
const retriveAllRank = async(req, res) => {
    try {
        // retrive
        const items = await db.rank.findAll();
        if(!items){
            return res.status(400).json({ error : "failed to retrieve"})
        }
        return res.status(200).json({ items })
    } catch (error) {
        return res.status(500).json({ error: "server error" })
    }
}

module.exports = {
    createNewRank,
    deleteOneRank,
    updateOneRank,
  /*   retriveOneRank, */
    retriveAllRank,
    
}