// modules
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
// db
const db = require("../models");
const { Console } = require("console");

// ** desc   create mission
// ** route  POST api/mission/create
// ** access private
// ** role   admin
const createNewMission = async (req, res) => {
  try {

    // attributs
    const {
      description,
      comment,
      start,
      finish,
      destination,
      planeId,
      planeLink,
      planePrice,
      hotelLink,
      hotelPrice,
      clientId,
      employeeId,
    } = req.body;
    console.log(req.body)
    // check client exist
    const checkClient = await db.client.findOne({
      where: { id:clientId, activated: true },
    });
    if (!checkClient) {
      return res
        .status(404)
        .json({ error: "client doesn't exist", code: "client" });
    }
    
    const checkEmployee = await db.employee.findOne({
      where: {
       id: employeeId,
      },
    });
    if (!checkEmployee) {
      return res
        .status(404)
        .json({ error: "employee doesn't exist", code: "employee" });
    }
    if (checkEmployee && checkEmployee.activated === false) {
      return res
        .status(409)
        .json({ error: "employee is not activated", code: "activated" });
    }
    // check passport
    if (checkEmployee.currentPassport === null) {
      return res
        .status(409)
        .json({ error: "invalid passport", code: "passport" });
    }
    // get employee current passport
   /*  const currentPassport = await db.passport.findOne({
      where: { id: checkEmployee.currentPassport },
    }); */
    // check nationalite
 /*    if (currentPassport.nationality !== destination) {
      // check visa
      const checkVisa = await db.visa.findOne({
        where: {
          passportId: currentPassport.id,
          valable_for: destination,
          expiresAt: {
            [Op.gte]: new Date(finish),
          },
        },
      });
      if (checkVisa) {
        return res.status(409).json({ error: "invalid visa", code: "visa" });
      }
    } */
    // check mission date
    const checkMission = await db.mission.findAll({
      where: {
        employeeId,
        start: {
          [Op.lte]: start, // date is the date you are interested in
        },
        finish: {
          [Op.gte]: finish, // date is the date you are interested in
        },
        accepted: true,
        declined: false,
        validated:false
      }, 
    });
    //
    console.log('checkMission: ***********************************************************************************************************************************************', checkMission);

    if (checkMission.length > 0) {
      return res
        .status(409)
        .json({ error: "mission already taken in that periode", code: "date" });
    }
    console.log(req.body)
    // create
    const newMission = await db.mission.create({
      description,
      comment,
      start,
      finish,
      destination,
      planeId,
      planeLink,
      planePrice,
      hotelLink,
      hotelPrice,
      clientId,
      employeeId,
      accepted: false,
      declined:false,
      validated: true
    });
    if (!newMission) {
      return res.status(400).json({ error: "failed to create" });
    }
    // ==>
    return res.status(201).json({ message: "created successfully" });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};
//create a validated mission 
const createChefMission = async (req, res) => {
  try {
      const id= req.params
    // attributs
    const {
      description,
      comment,
      start,
      finish,
      destination,
      planeId,
      planeLink,
      planePrice,
      hotelLink,
      hotelPrice,
      clientId,
      employeeId,
    } = req.body;
    console.log(req.body)
    // check client exist
    const checkClient = await db.client.findOne({
      where: { id:clientId, activated: true },
    });
    if (!checkClient) {
      return res
        .status(404)
        .json({ error: "client doesn't exist", code: "client" });
    }
    
    const checkEmployee = await db.employee.findOne({
      where: {
       id: id,
      },
    });

    if (!checkEmployee) {
      return res
        .status(404)
        .json({ error: "employee doesn't exist", code: "employee" });
    }
    if (checkEmployee && checkEmployee.activated === false) {
      return res
        .status(409)
        .json({ error: "employee is not activated", code: "activated" });
    }
    // check passport
    if (checkEmployee.currentPassport === null) {
      return res
        .status(409)
        .json({ error: "invalid passport", code: "passport" });
    }
    /* // get employee current passport
    const currentPassport = await db.passport.findOne({
      where: { id: checkEmployee.currentPassport },
    });
    // check nationalite
    if (currentPassport.nationality !== destination) {
      // check visa
      const checkVisa = await db.visa.findOne({
        where: {
          passportId: currentPassport.id,
          valable_for: destination,
          expiresAt: {
            [Op.gte]: new Date(finish),
          },
        },
      });
      if (checkVisa) {
        return res.status(409).json({ error: "invalid visa", code: "visa" });
      }
    } */
    // check mission date
    const checkMission = await db.mission.findAll({
      where: {
        employeeId,
        start: {
          [Op.lte]: start, // date is the date you are interested in
        },
        finish: {
          [Op.gte]: finish, // date is the date you are interested in
        },
        accepted: true,
        declined: false,
      },
    });
    //
    console.log('checkMission: ***********************************************************************************************************************************************', checkMission);

    if (checkMission.length > 0) {
      return res
        .status(409)
        .json({ error: "mission already taken in that periode", code: "date" });
    }
    console.log(req.body)
    // create
    const newMission = await db.mission.create({
      description,
      comment,
      start,
      finish,
      destination,
      planeId,
      planeLink,
      planePrice,
      hotelLink,
      hotelPrice,
      clientId,
      employeeId,
      accepted: false,
      declined:false,
      validated: true
    });
    if (!newMission) {
      return res.status(400).json({ error: "failed to create" });
    }
    // ==>
    return res.status(201).json({ message: "created successfully" });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};
// ** desc   create mission
// ** route  POST api/mission/create
// ** access private
// ** role   admin
const createMissionByEmployee = async (req, res) => {
  try {
const employeeId=req.employee.id
    // attributs
    const {
      description,
      comment,
      start,
      finish,
      destination,
      planeId,
      planeLink,
      /* planePrice, */
      hotelLink,
      /* hotelPrice, */
      clientId,
      
    } = req.body;
    console.log(req.body)
    // check client exist
    const checkClient = await db.client.findOne({
      where: { id:clientId, activated: true },
    });
    if (!checkClient) {
      return res
        .status(404)
        .json({ error: "client doesn't exist", code: "client" });
    }
    const checkEmployee = await db.employee.findOne({
      where: {
       id: employeeId,
      },
    });
    if (!checkEmployee) {
      return res
        .status(404)
        .json({ error: "employee doesn't exist", code: "employee" });
    }
    if (checkEmployee && checkEmployee.activated === false) {
      return res
        .status(409)
        .json({ error: "employee is not activated", code: "activated" });
    }
    // check passport
    if (checkEmployee.currentPassport === null) {
      return res
        .status(409)
        .json({ error: "invalid passport", code: "passport" });
    }
  /*   // get employee current passport
    const currentPassport = await db.passport.findOne({
      where: { id: checkEmployee.currentPassport },
    });
    // check nationalite
    if (currentPassport.nationality !== destination) {
      // check visa
      const checkVisa = await db.visa.findOne({
        where: {
          passportId: currentPassport.id,
          valable_for: destination,
          expiresAt: {
            [Op.gte]: new Date(finish),
          },
        },
      });
      if (checkVisa) {
        return res.status(409).json({ error: "invalid visa", code: "visa" });
      }
    } */
    // check mission date
    const checkMission = await db.mission.findOne({
      where: {
        employeeId,
        start: {
          [Op.lte]: start, // date is the date you are interested in
        },
        finish: {
          [Op.gte]: finish, // date is the date you are interested in
        },
        accepted: true,
        declined: false,
      }, //didn't understand
    });
    //
    if (checkMission) {
      return res
        .status(409)
        .json({ error: "mission already taken in that periode", code: "date" });
    }
    console.log(req.body)
    // create
    const newMission = await db.mission.create({
      description,
      comment,
      start,
      finish,
      destination,
      planeId,
      planeLink,
     /*  planePrice, */
      hotelLink,
      /* hotelPrice, */
      clientId,
      employeeId,
      accepted: false,
    });
    if (!newMission) {
      return res.status(400).json({ error: "failed to create" });
    }
    // ==>
    return res.status(201).json({ message: "created successfully" });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};

// ** desc   delete mission
// ** route  DELETE api/mission/delete/:id
// ** access private
// ** role   admin
const deleteOneMission = async (req, res) => {
  try {
    // Attributes
    const { id } = req.params;

    // Find the mission by ID
    const mission = await db.mission.findByPk(id);
    if (!mission) {
      return res.status(404).json({ error: "Mission not found" });
    }

    // Find invoices with the ID of the mission
    const invoices = await db.invoice.findAll({
      where: {
        missionId: id,
      },
    });

    // Delete the invoices if they exist
    for (const invoice of invoices) {
        // Retrieve all globalinvoices associated with the invoiceID
        const globalinvoices = await db.globalInvoice.findAll({
          where: {
            invoiceIds: {
              [Op.contains]: [invoice.id],
            }
          },
        });

        // Delete each globalinvoice
        for (const globalinvoice of globalinvoices) {
          await globalinvoice.destroy();
        }

        await invoice.destroy();
    }

    // Delete the mission
    await mission.destroy();

    // Return success response
    return res.status(202).json({ message: "Mission and associated invoices deleted successfully" });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ error: "Server error" });
  }
};


// ** desc   delete mission
// ** route  DELETE api/mission/delete/:id
// ** access private
// ** role   admin
const deleteallMission = async (req, res) => {
  try {
    // Delete all missions
    const deleteMission = await db.mission.destroy({ where: {} });
    
    if (!deleteMission) {
      return res.status(400).json({ error: "Failed to delete missions" });
    }
    
    return res.status(202).json({ message: "Missions deleted successfully" });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ** desc   update mission
// ** route  PUT api/mission/update/:id
// ** access private
// ** role   admin
const updateOneMission = async (req, res) => {
  try {
    // attributs
    const { id } = req.params;
    // attributs
    const {
      description,
      comment,
      start,
      finish,
      destination,
      planeId,
      planeLink,
      planePrice,
      hotelLink,
      hotelPrice
    } = req.body;
    // check if the mission exist
    const checkMission = await db.mission.findByPk(Number(id));
    if (!checkMission) {
      return res
        .status(404)
        .json({ error: "mission does't exist", code: "mission" });
    }

    //checks
    const checkAvailability = await db.mission.findOne({
      where: {
        id: {
          [Op.ne]: id,
        },
        employeeId: checkMission.employeeId,
        start: {
          [Op.lte]: start, // date is the date you are interested in
        },
        finish: {
          [Op.gte]: finish, // date is the date you are interested in
        },
        accepted: true,
        declined: false,
      },
    });
    if (checkAvailability) {
      return res.status(409).json({ error: "date unavailable", code: "date" });
    }

    if(checkMission.accepted===true){
      const updateInvoice = await db.invoice.update({
        from:checkMission.start,
      to:checkMission.end,
      planePrice: checkMission.planePrice,
      hotelPrice:checkMission.hotelPrice,
      },{
        where:{
          missionId:checkMission.id
        }
      })
      if(!updateInvoice){
        return res.status(400).json({error:"failed to update"})
      }
    }
    // update
    const updateMission = await db.mission.update(
      {
        description,
        comment,
        start: new Date(start),
        finish: new Date(finish),
        destination,
        planeId,
      planeLink,
      planePrice,
      hotelLink,
      hotelPrice
      },
      { where: { id } }
    );
    if (!updateMission) {
      return res.status(400).json({ error: "item does't exist" });
    }
    // ==>
    return res.status(202).json({ message: "updated successfully" });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};

// ** desc   update mission
// ** route  PUT api/mission/update/:id
// ** access private
// ** role   admin
const setMissionStatus = async (req, res) => {
  try {
    // params
    const { id } = req.params;
    // attributs
    const { accepted, declined, validated } = req.body;
    console.log("########################################################################################################################################################################"/* ,req.body */)
    /* if (accepted !== "true" && declined !== "true" && validated !=="true") {
      return res.status(406).json({ message: "operation invalid" });
    } */
    
    // check mission exist
    const checkMission = await db.mission.findByPk(Number(id));
    //console.log("this is check mission",checkMission)
    if (!checkMission) {
      return res.status(404).json({ message: "mission doesn't exist",code:"mission" });
    }
   
    //get employe
    const getEmployee = await db.employee.findByPk(Number(checkMission.employeeId),{
      include: [
        {
          model: db.rank,
          attributes: ["name", "permission", "perdiem"],
        },
      ],
    },)
    //console.log("this is the employee",getEmployee)
    if(!getEmployee){
      return res.status(404).json({error:"employee doesn't exist",code:"employee"})
    }
  
 
    // update
    const setMission = await db.mission.update(
      {
        
          accepted,
          declined,
          validated,
        
    },
      { where: { id } }
    );
    console.log("id",id)
    console.log("Set Mission:", accepted,declined,validated);
    if (!setMission) {
      return res.status(400).json({ message: "mission doesn't exist" });
    }
    
    if (accepted === true && declined === true && validated === true) {
      return res.status(406).json({ message: "operation invalid" });
    }

    if (accepted !== true && declined !== true && validated !== true) {
      return res.status(406).json({ message: "operation invalid" });
    }
     // Construct the appropriate message
  let message = "";
  if (accepted === true) {
    message = "Mission accepted successfully";
   
    // create invoice
                //create
                const newInvoice = await db.invoice.create({
                  start:checkMission.start,
                  end:checkMission.finish,
                  missionId:checkMission.id,
                  perdiem:getEmployee.rank.perdiem,
                  planePrice: checkMission.planePrice,
                  hotelPrice:checkMission.hotelPrice,
                  amount: checkMission.hotelPrice + checkMission.planePrice + getEmployee.rank?.perdiem || 0,
                  employeeId:checkMission.employeeId,
                  clientId:checkMission.clientId
                });
                if (!newInvoice) {
                  return res.status(400).json({ error: "failed to create" });
                } 
  } else if (declined === true) {
    message = "Mission declined successfully";
    //destroy invoice and globalinvoices
     // Find the invoice by ID
     const invoice = await db.invoice.findOne({
     where:{
      missionId:id
     } });
     if (!invoice) {
       return res.status(404).json({ error: "Invoice not found" });
     }
 
     // Find the global invoices with invoiceIds containing the invoice ID
     const globalInvoices = await db.globalInvoice.findAll({
       where: {
         invoiceIds: {
          [Op.contains]: [invoice.id],
         },
       },
     });
 
     // Delete the global invoices
     for (const globalInvoice of globalInvoices) {
       await globalInvoice.destroy();
     }
 
     // Delete the invoice
     await invoice.destroy();
 
     // Return success response
     return res.status(202).json({ message: "Invoice and associated global invoices deleted successfully" });
  } else if (validated === true) {
    message = "Mission validated successfully";
  } else {
    message = "NO";
  }
  
  return res.status(202).json({ message });
  
} catch (error) {
  console.log("error: ", error);
  return res.status(500).json({ error: "server error" });
}

}



/* const setConfirmMission  = async (req, res) => {
  try {
    // params
    const { id } = req.params;
     // check mission exist
     const checkMission = await db.mission.findByPk(Number(id));
     if (!checkMission) {
       return res.status(404).json({ message: "mission doesn't exist",code:"mission" });
     }
    
     if(checkMission.validated===false){
      return res.status(409).json({ message: "mission doesn't exist",code:"mission" })
     }

     const getEmployee=await db.employee.findOne({
      where: {
        id: checkMission.employeeId
      }
     })
      // update
    const setMission = await db.mission.update(
      {
        accepted: true , acceptedAt: Date.now()
      },
      { where: { id } })
      // create invoice
                //create
    const newInvoice = await db.invoice.create({
      from:checkMission.start,
      to:checkMission.finish,
      missionId:checkMission.id,
      perdiem:getEmployee.rank.perdiem,
      planePrice: checkMission.planePrice,
      hotelPrice:checkMission.hotelPrice,
      employeeId:checkMission.employeeId,
      clientId:checkMission.clientId
    });
    if (!newInvoice) {
      return res.status(400).json({ error: "failed to create" });
    } 
    
    if (!setMission) {
      return res.status(400).json({ message: "mission doesn't exist" });
    }
    //
    return res.status(202).json()}
   catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });

  }}
 */
// ** desc   find one mission
// ** route  GET api/mission/one/:id
// ** access private
// ** role   admin
const retriveOneMission = async (req, res) => {
  try {
    // attributs
    const { id } = req.params;
    // retrive
    const item = await db.mission.findByPk(
      id,
      {
        include: [
          {
            model: db.client,
            attributes: ["company_name", "email"],
          },
        ],
      },
      {
        include: [
          {
            model: db.employee,
            attributes: ["firstname", "lastname", "email"],
          },
        ],
      },
      {
        include: [
          {
            model: db.invoice,
            attributes: ["from", "to"],
          },
        ],
      }
    );
    if (!item) {
      return res.status(404).json({ error: "item doesnt exist" });
    }

    const passports = await db.passport.findAll({ where: { employeeId: id } });
    const invoice = await db.invoice.findOne({ where: { missionId: id } });
    //const empl = await db.employee.findOne({ where: { missionId: id } });
    // ==>
    return res.status(200).json({ item, passports, invoice });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};

// ** desc   find one mission
// ** route  GET api/mission/all
// ** access private
// ** role   admin
const retriveAllEmployeeMissions = async (req, res) => {
  try {
    // ** params
    const { id } = req.params;
    // ** find missions
    const items = await db.mission.findAll({
      where: { employeeId: id },
      include: [
        {
          model: db.client,
          as: "client",
        },
      ],
    });
    console.log("items: ", items);
    // ** ==>
    return res.status(200).json({ items });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};
// ** desc   find one mission
// ** route  GET api/mission/all
// ** access private
// ** role   admin
const retriveAll = async (req, res) => {
  try {
   
    // ** find missions
    const items = await db.mission.findAll({
      include: [
        {
          model: db.client,
          attributes: ['company_name', 'email'],
        },
        {
          model: db.employee,
          attributes: ['firstname', 'lastname', 'email'],
          
        },
      ],
    });
    console.log("items: ", items);
    // ** ==>
    return res.status(200).json({ items });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};
// ** desc   find one mission
// ** route  GET api/mission/all
// ** access private
// ** role   admin
const retriveAllMission = async (req, res) => {
  try {
    const { id } = req.params;
    // Retrieve all missions except the one associated with the specified employee ID
    const items = await db.mission.findAll({
      where: {
        employeeId: {
          [Op.ne]: id, // Exclude the specified employee ID
        },
      },
      include: [
        {
          model: db.client,
          attributes: ['company_name', 'email'],
        },
        {
          model: db.employee,
          attributes: ['firstname', 'lastname', 'email'],
          
        },
      ],
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

        
   
module.exports = {
  createNewMission,
  deleteOneMission,
  updateOneMission,
  retriveOneMission,
  retriveAllMission,
  retriveAllEmployeeMissions,
  setMissionStatus,
 // retriveEmployeeMissions,
  createMissionByEmployee,
  deleteallMission,
  retriveAll,
  createChefMission
};

