const db = require('../models');


// ** desc   create visa
// ** route  POST api/visa/create
// ** access private
// ** role   admin
const createNewVisa = async (req, res) => {
    try {
        // Params
        const { currentpassport} = req.params;
    console.log("passportId",currentpassport)
        // Attributes
        const { valable_for, startAt, expiresAt } = req.body;
    
        // Check if employee has a current passport
       /*  const checkEmployee = await db.employee.findOne({ where: { currentPassport: passportId } }); */
       /*  if (!checkEmployee) {
          return res.status(404).json({ error: "Employee not found", code: "employee" });
        } */
        const checkEmployee = await db.employee.findOne({where :{
            currentPassport:currentpassport
        }});
        console.log("checkEmployee",checkEmployee)
        if (!checkEmployee) {
            return res.status(404).json({ error: "Employee not found", code: "employee" });
        }
    
        // Retrieve the passport
        const getPassport = await db.passport.findOne({ where: { id: currentpassport } });
        if (!getPassport) {
          return res.status(404).json({ error: "Passport not found", code: "passport" });
        }
    
  
      // Check visa range against passport range
      const createdAtPassportDate = new Date(getPassport.createdAt);
      const startedAtDate = new Date(startAt);
      const expireAtPassportDate = new Date(getPassport.expiresAt);
      const expiresAtDate = new Date(expiresAt);
  
      if (startedAtDate < createdAtPassportDate || expiresAtDate > expireAtPassportDate) {
        return res
          .status(409)
          .json({ code: "range", error: "Visa range is outside the passport range" });
      }
  
    // Check if an existing visa with the same data exists
    const existingVisa = await db.visa.findOne({
        where: {
          valable_for,
          startAt,
          expiresAt,
          passportId: checkEmployee.currentPassport,
        },
      });
  
      if (existingVisa) {
        return res.status(409).json({code: "exist", error: "An existing visa with the same data already exists" });
      }
      // Create the visa
      const newVisa = await db.visa.create({
        valable_for,
        startAt,
        expiresAt,
        passportId: checkEmployee.currentPassport,
      });
  
      if (!newVisa) {
        return res.status(400).json({ error: "Failed to create visa" });
      }
  
      return res.status(201).json({ message: "Visa created successfully" });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ error: "Server error" });
    }
  };
  
// ** desc   create visa
// ** route  POST api/visa/create
// ** access private
// ** role   admin
const createVisaByAdmin = async(req, res) => {
    try {
        // params
        const employeeId=req.params.id
        console.log("employeeId",employeeId)
        // attributs
        const { valable_for, startAt, expiresAt } = req.body;
        // check employee existing
        const checkEmployee = await db.employee.findOne({ where: { id: employeeId } });
        if (!checkEmployee) {
            return res.status(404).json({ error: "passport doesn't exist",code:"employee" })
        }
        // check employee has a passport
        if(!checkEmployee.currentPassport){
            console.log("her ?")
            return res.status(409).json({ error: "passport doesn't exist",code:"passport" })
        }
        // retrive passport
        const getPassport = await db.passport.findOne({where:{id:checkEmployee.currentPassport}})
        if(!getPassport){
            return res.status(404).json({code:"passport"})
        }
        const createdAtPassportDate=new Date(getPassport.createdAt)
        const startedAtDate=new Date(startAt)
        const expireAtPassportDate=new Date(getPassport.expiresAt)
        const expiresAtDate=new Date(expiresAt)
        if(startedAtDate<createdAtPassportDate||expiresAtDate>expireAtPassportDate){
            console.log("no here")
            return res.status(409).json({code:"range",error:"visa range outside the passport range"})
        }
        // create
        const newVisa = await db.visa.create({
            valable_for,
            startAt,
            expiresAt,
            passportId:checkEmployee.currentPassport
        });

        if (!newVisa) {
            return res.status(400).json({ error: "failed to create" })
        }

        return res.status(201).json({ message: "created successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   delete visa
// ** route  DELETE api/visa/delete/:id
// ** access private
// ** role   admin
const deleteOneVisa = async(req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // can u delete visa in use ?

        // delete
        const deleteVisa = await db.visa.destroy({
            where: { id }
        });
        if (!deleteVisa) {
            return res.status(400).json({ error: "failed to delete" })
        }
        // ==>
        return res.status(202).json({ message: "deleted successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   update visa
// ** route  PUT api/visa/update/:id
// ** access private
// ** role   admin
const updateOneVisa = async(req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // attributs
        const { valable_for, startAt, expiresAt } = req.body;
        /*
        // check passport existing
        const checkUsage = await db.employee.findOne({ where: { currentPassport: passportId } });
        if (checkUsage) {
            return res.status(409).json({ error: "passport doesn't exist" })
        }*/
        // update
        const updateVisa = await db.visa.update({ valable_for, startAt, expiresAt }, { where: { id } });
        if (!updateVisa) {
            return res.status(400).json({ error: "item does't exist" })
        }
        // ==>
        return res.status(202).json({ message: "updated successfully" })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}

// ** desc   find one visa
// ** route  GET api/visa/one/:id
// ** access private
// ** role   admin
const retriveOneVisa = async(req, res) => {
    try {
        // attributs
        const { id } = req.params;
        // retrive
        const item = await db.visa.findByPk(id);
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

// ** desc   find one visa
// ** route  GET api/visa/all
// ** access private
// ** role   admin
const retriveAllVisa = async(req, res) => {
    try {
        // retrive
        const items = await db.visa.findAll();
        // ==>
        return res.status(200).json({ items })
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    }
}
// ** desc   find all visas for a passport
// ** route  GET api/visa/all/:passportId
// ** access private
// ** role   admin
const retriveAllPassportVisa = async (req, res) => {
    try {
      // ** params
      const { passportId } = req.params;
      
      // ** find visas
      const visas = await db.visa.findAll({
        where: { passportId },
      });
  
      console.log("visas: ", visas);
  
      // ** ==>
      return res.status(200).json({ visas });
    } catch (error) {
      console.log("error: ", error);
      return res.status(500).json({ error: "server error" });
    }
  };
  
  
  
module.exports = {
    createNewVisa,
    deleteOneVisa,
    updateOneVisa,
    retriveOneVisa,
    retriveAllVisa,
    retriveAllPassportVisa,
    createVisaByAdmin
}