// modules
const Sequelize=require("sequelize")
const { Op } = require('sequelize');
// db
const db = require('../models');



// ** desc   create employee
// ** route  POST api/employee/create
// ** access private
// ** role   admin
const createNewEmployee = async(req, res) => {
    try {
        // attributs
        const { firstname, lastname, registration, email, rankId,withPassport } = req.body;
        // check rank exist
        const checkrank = await db.rank.findByPk(rankId);
        if (!checkrank) {
            return res.status(404).json({ error: "rank doesn't exist" })
        }
        // check email already used
        const checkEmail = await db.employee.findOne({ where: { email } });
        if (checkEmail) {
            return res.status(409).json({ error: "email already used",code:"email" })
        }
        
        //check registration already used
        const checkRegistration = await db.employee.findOne({ where: { registration } });
        if (checkRegistration) {
            return res.status(409).json({ error: "registration number already already used",code:"registration" })
        }
        // passport data
        let passport={}
        if(withPassport){
            passport={}
        }
        // create
        const newEmployee = await db.employee.create({
            firstname,
            lastname,
            registration,
            email,
            rankId
        });
        if (!newEmployee) {
            return res.status(400).json({ error: "failed to create" })
        }
        // ==>
        return res.status(201).json({ message: "created successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   delete employee
// ** route  DELETE api/employee/delete/:id
// ** access private
// ** role   admin
const deleteOneEmployee = async(req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // create
        const deleteEmployee = await db.employee.destroy({
            where: { id }
        });
        if (!deleteEmployee) {
            return res.status(400).json({ error: "failed to delete" })
        }
        // ==>
        return res.status(202).json({ message: "deleted successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   update employee
// ** route  PUT api/employee/update/:id
// ** access private
// ** role   admin
const updateOneEmployee = async(req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // attributs
        const { firstname, lastname, registration, email, rankId, activated } = req.body;
        // check rank exist
        const checkrank = await db.rank.findByPk(rankId);
        if (!checkrank) {
            return res.status(404).json({ error: "rank doesn't exist" })
        }
        // check email
        const checkEmail = await db.employee.findOne({
            where: {
                email,
                id: {
                    [Op.ne]: id,
                },
            }
        })
        if (checkEmail) {
            return res.status(409).json({ error: "email already used" })
        }
        //check registration already used
        const checkRegistration = await db.employee.findOne({  where: {
            registration,
            id: {
                [Op.ne]: id,
            },
        } });
        if (checkRegistration) {
            return res.status(409).json({ error: "registration number already used" })
        }
        // update
        const updateEmployee = await db.employee.update({ firstname, lastname, registration, email, rankId, activated }, { where: { id } });
        if (!updateEmployee) {
            return res.status(400).json({ error: "item does't exist" })
        }
        // ==>
        return res.status(202).json({ message: "updated successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   find one employee
// ** route  GET api/employee/one/:id
// ** access private
// ** role   admin
const retriveOneEmployee = async(req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // retrive
        const item = await db.employee.findByPk(id, {
            include: [{
                model: db.rank,
                attributes: ['name', 'permission', 'perdiem']
            }, ]
        }, {
            include: [{
                model: db.passport,
            }]
        });
        if (!item) {
            return res.status(404).json({ error: "item doesnt exist" })
        }

        const passports = await db.passport.findAll({ where: { employeeId: id }/* , order: [['currentPassport', 'DESC']] */ })
            // ==>
        return res.status(200).json({ item, passports })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   find one employee
// ** route  GET api/employee/all
// ** access private
// ** role   admin
const retriveAllEmployee = async(req, res) => {
    try {
        // retrive
        const items = await db.employee.findAll({   
            include: [{
                model: db.rank
              }/* , {
                model: db.passport,
                where: { id: Sequelize.col('employee.currentPassport') }
              } */],
        });
          console.log("items: ",items)
        return res.status(200).json({ items })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

module.exports = {
    createNewEmployee,
    deleteOneEmployee,
    updateOneEmployee,
    retriveOneEmployee,
    retriveAllEmployee
}