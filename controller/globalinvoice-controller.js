const { Op } = require("sequelize");
const db = require("../models");
const {sendMail} = require ("./sendmail")
const createGlobalInvoice = async (req, res) => {
    try {
      const { start, end, clientId } = req.body;
      
      
     
  
      
      let queries = {
        start: { [Op.gte]: new Date(start) },
        end: { [Op.lte]: new Date(end) },
        clientId: clientId,
      };
     console.log("queries: ",queries)
     // Validate the start and end parameters
     if (!start || !end || clientId==='all') {
      return res.status(400).json({ error: 'Missing required parameters' , code:'parameters '});
    }
      // Check if there is an existing global invoice with the same queries
    const existingGlobalInvoice = await db.globalInvoice.findOne({
      where: {
        start:start,
        end:end
      },
    });

    if (existingGlobalInvoice) {
      // If an existing global invoice is found, return an error indicating it already exists
      return res.status(400).json({ error: 'Global invoice already exists with the same queries', code:'exist' });
    }

     // Check if there are any invoices for the specified date range
     const hasInvoices = await db.invoice.count({
      where: queries,
    });

    if (hasInvoices === 0) {
      return res.status(400).json({ error: 'No invoices found for the specified date range', code: 'no_invoices' });
    }
   
      // Retrieve the invoices based on the queries
      const invoices = await db.invoice.findAll({
        where: {
          ...queries
        },
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
  //console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",invoices)
      // Calculate the total amount for the global invoice
      let totalAmount = 0;
      invoices.forEach((invoice) => {
        // Assuming there's a "amount" field in the invoice model
        totalAmount += invoice.amount || 0;
      });
  
      // Create the global invoice record in the database
      const globalInvoice = await db.globalInvoice.create({
        // Set the necessary fields for the global invoice
        // For example, you might have fields like "start", "end", "totalAmount", etc.
        start: start,
        end: end,
        clientId: clientId,
        totalAmount: totalAmount,
        send: false,
        paid: false,
        invoiceIds: invoices.map((invoice) => invoice.id), // Store the IDs of the retrieved invoices
      });
      console.log("querrrrrrrrrriiiiiiiiiizzzzzz",queries)
      return res.status(200).json({ globalInvoice });
    } catch (error) {
      console.log("error: ", error);
      return res.status(500).json({ error: "Server error" });
    }
  };
  
// ** desc   find one invoice
// ** route  GET api/invoice/all
// ** access private
// ** role   admin
const retrieveAllGlobalInvoices = async (req, res) => {
  try {
    const globalInvoices = await db.globalInvoice.findAll({
      include: [
        {
          model: db.client,
          attributes: ["company_name", "email"],
        },
      ],
    });

    if (!globalInvoices) {
      return res.status(404).json({ error: 'Global invoice not found' });
    }

    // Delete global invoices with empty invoices array
    for (const globalInvoice of globalInvoices) {
      const invoices = await db.invoice.findAll({
        where: {
          id: { [Op.in]: globalInvoice.invoiceIds },
        },
      });

      if (invoices.length === 0) {
        await globalInvoice.destroy();
      }
    }

    return res.status(200).json({ globalInvoices });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "server error" });
  }
};




  // ** desc   delete mission
// ** route  DELETE api/mission/delete/:id
// ** access private
// ** role   admin
const deleteOneglobalInvoice = async (req, res) => {
  try {
    // attributs
    const { id } = req.params;
    // create
    const deleteInvoice = await db.globalInvoice.destroy({
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

// ** desc   Retrieve all invoices inside a specific global invoice
// ** route  GET api/invoice/global/:id
// ** access private
// ** role   admin
const retrieveInvoicesByGlobalInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the global invoice by ID
    const globalInvoice = await db.globalInvoice.findByPk(id);

    if (!globalInvoice) {
      return res.status(404).json({ error: 'Global invoice not found' });
    }

    // Retrieve the invoices associated with the global invoice
    const invoices = await db.invoice.findAll({
      where: {
        id: globalInvoice.invoiceIds, // Retrieve invoices with matching IDs
      },
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
   
    return res.status(200).json({ invoices });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "Server error" });
  }
};


const setPaid = async (req, res) => {
  try {
    const { id } = req.params;

    // Update the paid status in the database
    await db.globalInvoice.update(
      {
        paid: true
      },
      {
        where: {
          id: id
        }
      }
    );

    // Fetch the updated record from the database
    const updatedInvoice = await db.globalInvoice.findOne({
      where: {
        id: id
      }
    });

    console.log("updated invoice:", updatedInvoice);

    // Send the response with the updated invoice
    return res.status(202).json(updatedInvoice);
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "Server error" });
  }
};





const retrieveGlobalInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the global invoice by ID
    const globalInvoice = await db.globalInvoice.findByPk(id, {
      include: [
        {
          model: db.client,
          attributes: ['company_name', 'email', 'address'],
        },
      ],
    });

    if (!globalInvoice) {
      return res.status(404).json({ error: 'Global invoice not found' });
    }

    // Retrieve the invoices associated with the global invoice
    const invoices = await db.invoice.findAll({
      where: {
        id: globalInvoice.invoiceIds, // Retrieve invoices with matching IDs
      },
      include: [
        {
          model: db.mission,
          attributes: ['start', 'finish', 'planePrice', 'hotelPrice', 'description', 'destination'],
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
          ],
        },
      ],
    });

    sendMail(globalInvoice, invoices);
    console.log('globalInvoice.id', globalInvoice);

      // Send the response
      if (res.status(200)) {
        // Update globalInvoice.send to true
        await db.globalInvoice.update({ send: true }, { where: { id: globalInvoice.id } });
        console.log("send",globalInvoice.send)
        return res.status(200).json({ globalInvoice, invoices });
      }
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json({ error: 'Server error' });
  }
 
};
//********************************************************** */
const retrieveGlobalInvoiceDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the global invoice by ID
    const globalInvoice = await db.globalInvoice.findByPk(id, {
      include: [
        {
          model: db.client,
          attributes: ['company_name', 'email','address'],
        },
        
      ]
      
    });

    if (!globalInvoice) {
      return res.status(404).json({ error: 'Global invoice not found' });
    }
// Retrieve the invoices associated with the global invoice
const invoices = await db.invoice.findAll({
  where: {
    id: globalInvoice.invoiceIds, // Retrieve invoices with matching IDs
  },
  include: [
    {
      model: db.mission,
      attributes:["start","finish","planePrice","hotelPrice","description","destination"],
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
        
      ],
    },
  ],
})

    return res.status(200).json({ globalInvoice, invoices });
  
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json({ error: 'Server error' });
  }
 
};
module.exports={
    createGlobalInvoice,
    retrieveAllGlobalInvoices,
    deleteOneglobalInvoice,
    retrieveInvoicesByGlobalInvoice,
    retrieveGlobalInvoiceById,
    retrieveGlobalInvoiceDetails,
    setPaid
}