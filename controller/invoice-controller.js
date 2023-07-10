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
          attributes: ['start',"id", 'finish', 'planePrice', 'hotelPrice', 'description', 'destination'],
          include: [
            {
              model: db.employee,
              attributes: ['firstname', 'lastname', 'email'],
              include: [
                {
                  model: db.rank,
                  attributes: ['perdiem'],
                },
              ],
            },
            {
              model: db.client,
              attributes: ['company_name', 'address', 'email'],
            },
          ],
        },
      ],
    });

    if (!item) {
      return res.status(404).json({ error: "Item doesn't exist" });
    }

    // Extract necessary data
    const mission = item.mission;
    const employee = mission.employee;
    const rank = employee.rank;
    const client = mission.client;

    // Return the result
    return res.status(200).json({ item: { item, mission, employee, rank, client } });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ error: "Server error" });
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
    // Attributes
    const { id } = req.params;

    // Find the invoice by ID
    const invoice = await db.invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Find the global invoices with invoiceIds containing the invoice ID
    const globalInvoices = await db.globalInvoice.findAll({
      where: {
        invoiceIds: {
          [Op.contains]: [id],
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
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ error: "Server error" });
  }
};






module.exports={
    retrieveInvoice,
    retrieveAllInvoices,
    retrieveInvoices,
    deleteOneInvoice
};