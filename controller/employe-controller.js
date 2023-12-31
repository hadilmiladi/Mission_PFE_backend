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
    const { firstname, lastname, registration, email, rankId } =
      req.body;
    // check rank exist
    const checkrank = await db.rank.findByPk(rankId);
    if (!checkrank) {
      return res.status(404).json({ error: "rank doesn't exist" , code:"rank" });
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
      return res.status(404).json({ error: "rank doesn't exist", code:"rank" });
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
      return res.status(409).json({ error: "email already used" , code :"email"});
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
        .json({ error: "registration number already used" , code:"registration" });
    }
    // update
    const updateEmployee = await db.employee.update(
      { firstname, lastname, registration, email, rankId, activated },
      { where: { id } }
    );
    if (!updateEmployee) {
      return res.status(400).json({ error: "failed to update" });
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
            model: db.mission,
            
          },
        ],
      },
    );
    if (!item) {
      return res.status(404).json({ error: "employee doesn't exist" });
    }

    const mission = await db.mission.findAll({
      where: { employeeId:id} 
    });
     
   
    // ==>
    return res.status(200).json({ item, mission  });
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
            model: db.mission,
            
          },
        ],
      },
    );
    if (!item) {
      return res.status(404).json({ error: "item doesnt exist" });
    }
   
    console.log("employee: ",req.employee)
    const mission = await db.mission.findAll({
      where: { employeeId:req.employee.id } 
    });
     
    
    // ==>
    return res.status(200).json({ item,  mission  });
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
    const items = await db.employee.findAll({
      include: [
        {
          model: db.rank,
          where: {
            permission: {
              [Op.ne]: "admin",
            },
          },
        },
      ],
    });
    if(!items){
      return res.status(404).json({error: "failed to retrieve"})
    }
    return res.status(200).json({ items });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "server error" });
  }
};
const retriveAll = async (req, res) => {
  try {
    const items = await db.employee.findAll({
      include: [{model:db.rank}]
    });
    if(!items){
      return res.status(404).json({error: "failed to retrieve"})
    }
    return res.status(200).json({ items });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "server error" });
  }
};

const retriveEmployeeName = async (req, res) => {
  try {
      const id= req.params.id
    // Retrieve all employees except your own data
    const items = await db.employee.findOne({
     where:{
      id:id
     }
    });
    return res.status(200).json( items.firstname );
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "server error" });
  }
};

const deleteall = async (req, res) => {
    try {
      // Attributes
      const { id } = req.params;
      const employee = await db.employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      await employee.destroy();
       return res.status(200).json({ message: 'Employee and associated data deleted successfully' });
    } catch (error) {
      console.log('error: ', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
module.exports = {
  createNewEmployee,
  deleteOneEmployee,
  updateOneEmployee,
  retriveOneEmployee,
  retriveAllEmployee,
  retriveOneEmployeeProfil,
  retriveStatus,
  retriveEmployeeName,
  retriveAll,
  deleteall
  
 
};
