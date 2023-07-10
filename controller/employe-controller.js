// modules
const { Op } = require("sequelize");
// db
const db = require("../models");

// ** desc   create employee
// ** route  POST api/employee/create
// ** access private
// ** role   admin
const createNewEmployee = async (req, res) => {
  try {
    // attributs
    const { firstname, lastname, registration, email, rankId, withPassport } =
      req.body;
    // check rank exist
    const checkrank = await db.rank.findByPk(rankId);
    if (!checkrank) {
      return res.status(404).json({ error: "rank doesn't exist" });
    }
    // check email already used
    const checkEmail = await db.employee.findOne({ where: { email } });
    if (checkEmail) {
      return res
        .status(409)
        .json({ error: "email already used", code: "email" });
    }

    //check registration already used
    const checkRegistration = await db.employee.findOne({
      where: { registration },
    });
    if (checkRegistration) {
      return res
        .status(409)
        .json({
          error: "registration number already already used",
          code: "registration",
        });
    }
    // passport data
    let passport = {};
    if (withPassport) {
      passport = {};
    }
    // create
    const newEmployee = await db.employee.create({
      firstname,
      lastname,
      registration,
      email,
      rankId,
    });
    if (!newEmployee) {
      return res.status(400).json({ error: "failed to create" });
    }
    // ==>
    return res.status(201).json({ message: "created successfully" });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};

// ** desc   delete employee
// ** route  DELETE api/employee/delete/:id
// ** access private
// ** role   admin
const deleteOneEmployee = async (req, res) => {
  try {
    // Attributes
    const { id } = req.params;

    // Find the employee by ID
    const employee = await db.employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Retrieve all passports associated with the employee
    const passports = await db.passport.findAll({
      where: {
        employeeId: id,
      },
    });

    // Delete each passport along with its associated visas
    for (const passport of passports) {
      // Find all visas associated with the passport
      const visas = await db.visa.findAll({
        where: {
          passportId: passport.id,
        },
      });

      // Delete each visa
      for (const visa of visas) {
        await visa.destroy();
      }

      await passport.destroy();
    }

    // Retrieve all missions associated with the employee
    const missions = await db.mission.findAll({
      where: {
        employeeId: id,
      },
    });

    for (const mission of missions) {
      // Retrieve all invoices associated with the mission
      const invoices = await db.invoice.findAll({
        where: {
          missionId: mission.id,
        },
      });

      // Delete each invoice and its associated globalinvoices
      for (const invoice of invoices) {
        // Retrieve all globalinvoices associated with the invoiceID
        const globalinvoices = await db.globalInvoice.findAll({
          where: {
            invoiceId: invoice.id,
          },
        });

        // Delete each globalinvoice
        for (const globalinvoice of globalinvoices) {
          await globalinvoice.destroy();
        }

        await invoice.destroy();
      }

      await mission.destroy();
    }

    // Delete the employee
    await employee.destroy();

    // Return success response
    return res.status(202).json({ message: 'Employee and associated data deleted successfully' });
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json({ error: 'Server error' });
  }
};



// ** desc   update employee
// ** route  PUT api/employee/update/:id
// ** access private
// ** role   admin
const updateOneEmployee = async (req, res) => {
  try {
    // attributs
    const { id } = req.params;
    // attributs
    const { firstname, lastname, registration, email, rankId, activated } =
      req.body;
    // check rank exist
    const checkrank = await db.rank.findByPk(rankId);
    if (!checkrank) {
      return res.status(404).json({ error: "rank doesn't exist" });
    }
    // check email
    const checkEmail = await db.employee.findOne({
      where: {
        email,
        id: {
          [Op.ne]: id,
        },
      },
    });
    if (checkEmail) {
      return res.status(409).json({ error: "email already used" });
    }
    //check registration already used
    const checkRegistration = await db.employee.findOne({
      where: {
        registration,
        id: {
          [Op.ne]: id,
        },
      },
    });
    if (checkRegistration) {
      return res
        .status(409)
        .json({ error: "registration number already used" });
    }
    // update
    const updateEmployee = await db.employee.update(
      { firstname, lastname, registration, email, rankId, activated },
      { where: { id } }
    );
    if (!updateEmployee) {
      return res.status(400).json({ error: "item does't exist" });
    }
    // ==>
    return res.status(202).json({ message: "updated successfully" });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};

// ** desc   find one employee
// ** route  GET api/employee/one/:id
// ** access private
// ** role   admin
const retriveOneEmployee = async (req, res) => {
  try {
    // attributs
    const id=req.params.id
    let currentPassport=null
    // retrive
    const item = await db.employee.findByPk(
      id,
      {
        include: [
          {
            model: db.rank,
            attributes: ["name", "permission", "perdiem"],
          },
        ],
      },
      {
        include: [
          {
            model: db.passport,
          },
        ],
      },
      {
        include: [
          {
            model: db.mission,
            
          },
        ],
      },
    );
    if (!item) {
      return res.status(404).json({ error: "item doesnt exist" });
    }
    if(item?.currentPassport){
      currentPassport=await db.passport.findOne({where:{id:item?.currentPassport}})
    }

    const mission = await db.mission.findAll({
      where: { employeeId:id} 
    });
     
    const passports = await db.passport.findAll({
      where: { employeeId: id } /* , order: [['currentPassport', 'DESC']] */,
    });
    console.log("current passport: ",currentPassport)
    // ==>
    return res.status(200).json({ item, passports,currentPassport , mission  });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};

//retrieve status 
const retriveStatus = async (req, res) => {
  try {
    // attributs
    const id=req.params.id
    
    // retrive
    const item = await db.employee.findByPk(id , {
      attributes: ['activated'],
    })
    
   
    return res.status(200).json({ item });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};

// ** desc   find one employee
// ** route  GET api/employee/one/:id
// ** access private
// ** role   admin
const retriveOneEmployeeProfil = async (req, res) => {
  try {
    // attributs
    //const id=req.employee.id
    let currentPassport=null
    // retrive
    const item = await db.employee.findOne(
      
      {
        include: [
          {
            model: db.rank,
            attributes: ["name", "permission", "perdiem"],
          },
        ],
      },
      {
        include: [
          {
            model: db.passport,
          },
        ],
      },
      {
        include: [
          {
            model: db.mission,
            
          },
        ],
      },
    );
    if (!item) {
      return res.status(404).json({ error: "item doesnt exist" });
    }
    if(item?.currentPassport){
      currentPassport=await db.passport.findOne({where:{id:item?.currentPassport}})
    }
    console.log("employee: ",req.employee)
    const mission = await db.mission.findAll({
      where: { employeeId:req.employee.id } 
    });
     
    const passports = await db.passport.findAll({
      where: { employeeId: req.employee.id  } /* , order: [['currentPassport', 'DESC']] */,
    });
    // ==>
    return res.status(200).json({ item, passports,currentPassport , mission  });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};







// ** desc   find one employee
// ** route  GET api/employee/all
// ** access private
// ** role   admin
const retriveAllEmployee = async (req, res) => {
  try {
    const { id } = req.params; // Replace `yourEmployeeId` with the actual parameter name for your own employee ID

    // Retrieve all employees except your own data
    const items = await db.employee.findAll({
      where: {
        id: {
          [Op.ne]: id, // Exclude your own employee ID
        },
      },
      include: [
        {
          model: db.rank,
        },
        // Add other included models if needed
      ],
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "server error" });
  }
};


module.exports = {
  createNewEmployee,
  deleteOneEmployee,
  updateOneEmployee,
  retriveOneEmployee,
  retriveAllEmployee,
  retriveOneEmployeeProfil,
  retriveStatus
 
};
