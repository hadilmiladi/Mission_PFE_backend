const { Op } = require("sequelize");
const db = require("../models");
const {sendMailGmail,sendMailOutlook,getAll} = require ("./sendmail")

const createGlobalInvoice = async (req, res) => {
  try {
    const { start, end, clientId } = req.body;

    if (clientId === 'all') {
      const allClients = await db.client.findAll();

      for (const client of allClients) {
        const invoiceQueries = {
          start: { [Op.gte]: new Date(start) },
          end: { [Op.lte]: new Date(end) },
          clientId: client.id,
        };

        await createGlobalInvoiceForQueries(invoiceQueries, start, end, client.id);
      }

      return res.status(200).json({ message: 'Global invoices created successfully' });
    } else {
      const queries = {
        start: { [Op.gte]: new Date(start) },
        end: { [Op.lte]: new Date(end) },
        clientId: clientId,
      };

    

      await createGlobalInvoiceForQueries(queries, start, end, clientId);

      return res.status(200).json({ message: 'Global invoice created successfully' });
    }
  } catch (error) {
    //console.log('error: ', error.code);
    if (error.code==='parameters'){
      return res.status(400).json({ code: 'parameters' });
    }
    else if (error.code==='exist'){
      return res.status(400).json({ code: 'exist' });
    }
    else if (error.code==='no_invoices'){
      return res.status(400).json({ code: 'no_invoices' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

const createGlobalInvoiceForQueries = async (queries, start, end, clientId) => {
    // Validate the start and end parameters
    if (start===end) {
      throw { error: 'No parameters', code: 'parameters' };
    }
  const existingGlobalInvoice = await db.globalInvoice.findOne({
    where: {
      start:start,
      end:end,
      clientId:clientId,
    },
  });

  if (existingGlobalInvoice) {
    throw { error: 'Global invoice already exists with the same queries', code: 'exist' };
  }

  const hasInvoices = await db.invoice.count({
    where: queries,
  });

  if (hasInvoices === 0) {
    throw { error: 'No invoices found for the specified date range', code: 'no_invoices' };
  }

  const invoices = await db.invoice.findAll({
    where: queries,
    include: [
      // Include your necessary associations
    ],
  });

  let totalAmount = 0;
  invoices.forEach((invoice) => {
    totalAmount += invoice.amount || 0;
  });

  await db.globalInvoice.create({
    start: start,
    end: end,
    clientId: clientId,
    totalAmount: totalAmount,
    send: false,
    paid: false,
    invoiceIds: invoices.map((invoice) => invoice.id),
  });
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
    await updateDeadLine();
    
    return res.status(200).json({ globalInvoices });
    
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "server error" });
  }
};


//deadline 

 const updateDeadLine = async () => {
  try {
      
        const globalInvoices = await db.globalInvoice.findAll({
          where: {
            send: true, 
            paid: false
          }
        });
    
        const today = new Date(); // Get today's date
//console.log("globalInvoices",globalInvoices)
const updatedIds = [];
        for (const globalInvoice of globalInvoices){
          console.log('sendAt:', globalInvoice.sendat);
          const delais = new Date(globalInvoice.sendat);
          delais.setDate(delais.getDate() + 30);
          console.log('delais:', delais);
          console.log("id",globalInvoice.id)
          
           // Compare delais with today's date
           if ((delais.toDateString() !== today.toDateString())) {
            await db.globalInvoice.update(
              {
                deadline: true,
              },
              {
                where:{
                  id:globalInvoice.id
                }
              }
            )
            updatedIds.push(globalInvoice.id);
            
      }
      
        
        };
        console.log("ids",updatedIds)
        return updatedIds
    }
    catch (error) {
      console.log("error: ", error);
      return error
    }
  }




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
        paid: true,
        
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

    console.log("updated invoice:^^^^^^^^^^^^^^^^^^^^^^^^^^^^", updatedInvoice);
    
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

    /*  */
    let getall= await getAll();
    console.log('gggggeeeeeetttttt',getall.typeofmail)
    if(getall.typeofmail==='gmail' ){
      sendMailGmail(globalInvoice, invoices);
    }
    else if(getall.typeofmail==='outlook'){
      sendMailOutlook(globalInvoice, invoices);
    }
    console.log('globalInvoice.id', globalInvoice);

      // Send the response
      if (res.status(200)) {
        // Update globalInvoice.send to true
        await db.globalInvoice.update({ send: true, sendat:new Date() }, { where: { id: globalInvoice.id } });
        console.log("send",globalInvoice.send)

        const delais = new Date(globalInvoice.sendat);
  delais.setDate(delais.getDate() + 30);


        console.log("sendattttttttttttttttttttt",globalInvoice.sendat)
        console.log("sendat",delais)
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
    setPaid,
    updateDeadLine
}



    /* if (res.status(200)) {
      
        const globalInvoices = await db.globalInvoice.findAll({
          where: {
            send: true, // Filter for globalInvoices where send is true
          }
        });
    
        if (!globalInvoices) {
          return res.status(404).json({ error: 'Global invoice not found' });
        }
        const today = new Date(); // Get today's date

        globalInvoices.forEach((globalInvoice) => {
          console.log('sendAt:', globalInvoice.sendat);
          const delais = new Date(globalInvoice.sendat);
          delais.setDate(delais.getDate() + 30);
          console.log('delais:', delais);
          
           // Compare delais with today's date
           if ((delais.toDateString() === today.toDateString())) {
        return false
      }
     
        
        });
    } */