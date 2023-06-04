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
    // check client exist
    const checkClient = await db.client.findOne({
      where: { id: clientId, activated: true },
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
    }
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
      planePrice,
      hotelLink,
      hotelPrice,
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
    // attributs
    const { id } = req.params;
    // create
    const deleteMission = await db.mission.destroy({
      where: { id },
    });
    if (!deleteMission) {
      return res.status(400).json({ error: "failed to delete" });
    }
    // ==>
    return res.status(202).json({ message: "deleted successfully" });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
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

    if(checkAvailability.accepted===true){
      const updateInvoice = await db.invoice.update({
        from:checkAvailability.start,
      to:checkAvailability.end,
      planePrice: checkAvailability.planePrice,
      hotelPrice:checkAvailability.hotelPrice,
      },{
        where:{
          missionId:checkAvailability.id
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
    const { operation } = req.body;
    if (operation !== "accept" && operation !== "cancel") {
      return res.status(406).json({ message: "operation invalid" });
    }
    // check mission exist
    const checkMission = await db.mission.findByPk(Number(id));
    if (!checkMission) {
      return res.status(404).json({ message: "mission doesn't exist",code:"mission" });
    }
    //console.log("mission: ",mission)
    //  fget employe
    const getEmployee = await db.employee.findByPk(Number(checkMission.employeeId),{
      include: [
        {
          model: db.rank,
          attributes: ["name", "permission", "perdiem"],
        },
      ],
    },)
    if(!getEmployee){
      return res.status(404).json({error:"employee doesn't exist",code:"employee"})
    }
    // check its already accepted
    if (checkMission.accepted === true) {
      return res
        .status(409)
        .json({ message: "mission already accepted", code: "accepted" });
    }
    // check if its already declined
    else if (checkMission.accepted === true) {
      return res
        .status(409)
        .json({ message: "mission already declined", code: "declined" });
    }
    let changes = {};
    // accept it
    if (operation === "accept") {
      changes = { accepted: true, acceptedAt: Date.now(), declined: false };
      // create invoice
                //create
    const newInvoice = await db.invoice.create({
      from:checkMission.start,
      to:checkMission.finish,
      missionId:checkMission.id,
      perdiem:getEmployee.rank.perdiem,
      planePrice: checkMission.planePrice,
      hotelPrice:checkMission.hotelPrice,
    });
    if (!newInvoice) {
      return res.status(400).json({ error: "failed to create" });
    }
    }
    // declined
    else if (operation === "cancel") {
      changes = {
        accepted: false,
        declinedAt: Date.now(),
        declined: true,
        comment: req.body.comment,
      };
    }
    // update
    const setMission = await db.mission.update(
      {
        ...changes,
      },
      { where: { id } }
    );
    if (!setMission) {
      return res.status(400).json({ message: "mission doesn't exist" });
    }
    //
    return res.status(202).json({
      message:
        operation === "accept"
          ? "mission accepted successfully"
          : "mission declined successfully",
    });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};

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
const retriveAllMission = async (req, res) => {
  try {
    // retrive
    const items = await db.mission.findAll(
      {
        include: [
          {
            model: db.client,
            attributes: ["company_name", "email"],
          },
          {
            model: db.employee,
            attributes: ["firstname", "lastname", "email"],
          },
        ],
      }
      
    );
    //const employee= await db.mission.findOne({where :{employeeId: id}})
    // ==>
    return res.status(200).json({ items});
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
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
};
