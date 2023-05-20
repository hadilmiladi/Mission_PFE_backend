// modules
const { Op } = require('sequelize');
// db
const db = require('../models');



// ** desc   create client
// ** route  POST api/client/create
// ** access private
// ** role   admin
const createNewClient = async(req, res) => {
    try {
        // attributs
        const { company_name, code, address, email } = req.body;
        // check email already used
        const checkEmail = await db.client.findOne({ where: { email } });
        if (checkEmail) {
            return res.status(409).json({ error: "email already used",code:"email" })
        }
        const checkCode = await db.client.findOne({ where: { code } });
        if (checkCode) {
            return res.status(409).json({ error: "email already used",code:"code" })
        }
        // create
        const newClient = await db.client.create({
            company_name,
            code,
            address,
            email
        });
        if (!newClient) {
            return res.status(400).json({ error: "failed to create" })
        }
        // ==>
        return res.status(201).json({ message: "created successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   delete client
// ** route  DELETE api/client/delete/:id
// ** access private
// ** role   admin
const deleteOneClient = async(req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // create
        const deleteClient = await db.client.destroy({
            where: { id }
        });
        if (!deleteClient) {
            return res.status(400).json({ error: "failed to delete" })
        }
        // ==>
        return res.status(202).json({ message: "deleted successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   update client
// ** route  PUT api/client/update/:id
// ** access private
// ** role   admin
const updateOneClient = async(req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // attributs
        const { company_name, code, address, email, activated } = req.body;
        // check email
        const checkEmail = await db.client.findOne({ where: { email,id: {
            [Op.ne]: id,
        }, } });
        if (checkEmail) {
            return res.status(409).json({ error: "email already used",code:"email" })
        }
        const checkCode = await db.client.findOne({ where: { code,id: {
            [Op.ne]: id,
        }, } });
        if (checkCode) {
            return res.status(409).json({ error: "email already used",code:"code" })
        }
        
        // update
        const updateClient = await db.client.update({ company_name, code, address, email, activated }, { where: { id } });
        if (!updateClient) {
            return res.status(400).json({ error: "item does't exist" })
        }
        // ==>
        return res.status(202).json({ message: "updated successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   find one client
// ** route  GET api/client/one/:id
// ** access private
// ** role   admin
const retriveOneClient = async(req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // retrive
        const item = await db.client.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: "item doesnt exist" })
        }
        return res.status(200).json({ item });
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   find one client
// ** route  GET api/client/all
// ** access private
// ** role   admin
const retriveAllClient = async(req, res) => {
    try {
        // retrive
        const items = await db.client.findAll();
        // count all cliebts
        const size = await db.client.count()
        // ==>
        return res.status(200).json({ items,size })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

module.exports = {
    createNewClient,
    deleteOneClient,
    updateOneClient,
    retriveOneClient,
    retriveAllClient
}