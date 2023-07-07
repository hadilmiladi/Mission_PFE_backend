// modules
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
// db
const db = require("../models");
// ** desc   retrieve Invoice
// ** route  GET api/Invoice/retrieve
// ** access private
// ** role   admin
const retrieveInvoice = async (req, res) => {
    try {
      // params
      const { id } = req.params;
      
      // retrieve
      const item = await db.invoice.findOne({
        where: { missionId: id },
        include: [
          {
            model: db.mission,
          },
        ],
      });
      if (!item) {
        return res.status(404).json({ error: "item doesnt exist" });
      }
      const employee = await db.employee.findOne({where:{id:item.mission.employeeId}})
      if(!employee){
        return res.status(404).json({error:"item doesn't exist"})
      }
      const prxdium = await db.rank.findOne({id:employee.rankId})
      // Return the result
      const client = await db.client.findOne({where:{id:item.mission.clientId}})
      return res.status(200).json({ item:{item,prxdium,employee,client} });
    } catch (error) {
      console.log("error:", error);
      return res.status(500).json({ error: "server error" });
    }
  };
  
// ** desc   find one invoice
// ** route  GET api/invoice/all
// ** access private
// ** role   admin
const retrieveAllInvoices = async (req, res) => {
  try {
    /* const {start,end}=req.body;
    let queries={
      start:{[Op.gte]:new Date(start)},
      end:{[Op.lte]:new Date(end)}
    }
    console.log("queries: ",queries) */
    const items = await db.invoice.findAll({
     /*  where: {
        ...queries
      }, */
      include: [
        {
          model: db.mission,
          include: [
            {
              model: db.employee,
              attributes: ["firstname", "lastname", "email"],
              include: [
                {
                  model: db.rank,
                  attributes: ["perdiem"],
                },
              ],
            },
            {
              model: db.client,
              attributes: ["company_name", "email"],
            },
          ],
        },
      ],
    });
    
    console.log("items: ",items)
    return res.status(200).json({ items });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "server error" });
  }
};

// ** desc   find one invoice
// ** route  GET api/invoice/all
// ** access private
// ** role   admin
const retrieveInvoices = async (req, res) => {
  try {
    
    const items = await db.invoice.findAll({
      
      include: [
        {
          model: db.mission,
          include: [
            {
              model: db.employee,
              attributes: ["firstname", "lastname", "email"],
              include: [
                {
                  model: db.rank,
                  attributes: ["perdiem"],
                },
              ],
            },
            {
              model: db.client,
              attributes: ["company_name", "email"],
            },
          ],
        },
      ],
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "server error" });
  }
};
// ** desc   delete mission
// ** route  DELETE api/mission/delete/:id
// ** access private
// ** role   admin
const deleteOneInvoice = async (req, res) => {
  try {
    // attributs
    const { id } = req.params;
    // create
    const deleteInvoice = await db.invoice.destroy({
      where: { id },
    });
    if (!deleteInvoice) {
      return res.status(400).json({ error: "failed to delete" });
    }
    // ==>
    return res.status(202).json({ message: "deleted successfully" });
  } catch (error) {
    console.log("erro: ", error);
    return res.status(500).json({ error: "server error" });
  }
};



module.exports={
    retrieveInvoice,
    retrieveAllInvoices,
    retrieveInvoices,
    deleteOneInvoice
};