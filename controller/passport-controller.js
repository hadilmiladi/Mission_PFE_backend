const db = require('../models');
const { Op, DATEONLY, DataTypes } = require('sequelize');

// ** desc   create passport
// ** route  POST api/passport/create
// ** access private
// ** role   admin
const createNewPassport = async (req, res) => {
    try {
        const {employeeId}=req.params;
        // attributs
        const { registration, nationality, createdAt, expiresAt } = req.body;
        //check registration already used
        const checkRegistration = await db.passport.findOne({ where: { registration:String(registration) } });
        if (checkRegistration) {
            return res.status(409).json({ code: "registration" })
        }
        // check seconde date is after first
        if (createdAt >= expiresAt) {
            return res.status(409).json({ code: "date" })
        }
        // create
        const newPassport = await db.passport.create({
            registration,
            nationality,
            createdAt,
            expiresAt,
            employeeId,

        });
        if (!newPassport) {
            return res.status(400).json({ error: "failed to create" })
        }
        // set this passport to be valid
        const setValidpassport = await db.employee.update({ currentPassport: newPassport.id }, { where: { id: employeeId } })
        if (!setValidpassport) {
            return res.status(400).json({ error: "item doesn't exist" })
        }
        // ==>
        return res.status(201).json({ message: "created successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   delete passport
// ** route  DELETE api/passport/delete/:id
// ** access private
// ** role   admin
const deleteOnePassport = async (req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // check rank is being uqed by an other employee
        const checkUsage = await db.employee.findOne({ where: { currentPassport: id } });
        if (checkUsage) {
            return res.status(409).json({ error: "already active by an employee" })
        }
        // delete
        const deletePassport = await db.passport.destroy({
            where: { id }
        });
        if (!deletePassport) {
            return res.status(400).json({ error: "failed to delete" })
        }
        // ==>
        return res.status(202).json({ message: "deleted successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   update passport
// ** route  PUT api/passport/update/:id
// ** access private
// ** role   admin
const updateOnePassport = async (req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // attributs
        const { registration, nationality, createdAt, expiresAt, employeeId } = req.body;
        // check seconde date is after first
        if(createdAt>=expiresAt){
            return res.status(409).json({code:"date"})
        }
        //check registration already used
        const checkRegistration = await db.passport.findOne({
            where: {
                registration,
                id: {
                    [Op.ne]: id,
                },
            }
        });
        if (checkRegistration) {
            return res.status(409).json({ code: "registration" })
        }
        // update
        const updatePassport = await db.passport.update({ registration, nationality, createdAt, expiresAt, employeeId }, { where: { id } });
        if (!updatePassport) {
            return res.status(400).json({ error: "item does't exist" })
        }
        // ==>
        return res.status(202).json({ message: "updated successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   find one passport
// ** route  GET api/passport/one/:id
// ** access private
// ** role   admin
const retriveOnePassport = async (req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // retrive
        const item = await db.passport.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: "item doesnt exist" })
        }
        // ==>
        return res.status(200).json({ item })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   find one passport
// ** route  GET api/passport/all
// ** access private
// ** role   admin
const retriveAllPassport = async (req, res) => {
    try {
        // retrive
        const items = await db.passport.findAll();
        // ==>
        return res.status(200).json({ items })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

module.exports = {
    createNewPassport,
    deleteOnePassport,
    updateOnePassport,
    retriveOnePassport,
    retriveAllPassport
}