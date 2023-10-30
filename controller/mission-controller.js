const { getAll }= require ('./mailing-controller');
const {
  sendMissionGmail,
  sendMissionOutlook,
} =require ('./sendMission');

// modules
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
// db
const db = require("../models");

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
   
    // check mission date
    const checkMission = await db.mission.findAll({
      where: {
        employeeId,
        start: {
          [Op.lte]: start,
        },
        finish: {
          [Op.gte]: finish, 
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
       id:employeeId,
      },
    });
    if (checkEmployee && checkEmployee.activated === false) {
      return res
        .status(409)
        .json({ error: "employee is not activated", code: "activated" });
    }
    
    // check mission date
    const checkMission = await db.mission.findAll({
      where: {
        employeeId,
        start: {
          [Op.lte]: start, 
        },
        finish: {
          [Op.gte]: finish, 
        },
        accepted: true,
        declined: false,
      },
    });
    

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
      /* planePrice, */
      hotelLink,
      /* hotelPrice, */
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
      hotelLink,
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
   
    // check mission date
    const checkMission = await db.mission.findOne({
      where: {
        employeeId,
        start: {
          [Op.lte]: start, 
        },
        finish: {
          [Op.gte]: finish, 
        },
        accepted: true,
        declined: false,
      }, 
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
      hotelLink,
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
    const mission = await db.mission.findOne({
      where:{
        id:id,
        accepted:false,
        validated:false,
        declined:true
      }});
    if (!mission) {
      return res.status(400).json({ error: "can not delete a non declined mission" });
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
          [Op.lte]: start, 
        },
        finish: {
          [Op.gte]: finish, 
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
   
    
    // check mission exist
    const checkMission = await db.mission.findByPk(id,{
      include:[
        {
        model: db.client,
        attributes:['company_name','email']
        },
        {
          model: db.employee,
          attributes:['firstname','lastname','email']
          },
      ]});
    
    if (!checkMission) {
      return res.status(404).json({ message: "mission doesn't exist",code:"mission" });
    }
    console.log("checcckkkk",checkMission)
    //get employe
    const getEmployee = await db.employee.findByPk(checkMission.employeeId,{
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
    let getall= await getAll();
    if(getall.typeofmail==='gmail' ){
      sendMissionGmail(checkMission);
    }
    else if(getall.typeofmail==='outlook'){
      sendMissionOutlook(checkMission);
    }
  } else {
    message = "NO";
  }
  
  return res.status(202).json({ message });
  
} catch (error) {
  console.log("error: ", error);
  return res.status(500).json({ error: "server error" });
}

}




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

    
    const invoice = await db.invoice.findOne({ where: { missionId: id } });
    
    // ==>
    return res.status(200).json({ item,  invoice });
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
  createMissionByEmployee,
  deleteallMission,
  retriveAll,
  createChefMission
};

