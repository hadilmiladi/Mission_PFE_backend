const nodemailer = require("nodemailer");
const db = require("../models");

const sendMailGmail = async ( globalInvoice, invoices) => {

//
invoices.forEach((invoice) => {
  console.log("Start:", invoice.start);
  console.log("Finish:", invoice.finish);
  console.log("Description:", invoice.mission.description);
});

let totalAmount = 0;
const getconfig=await getAll()
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: getconfig.from,
          pass: getconfig.password
        }
      });
      //lezmou fi ecran config wahda okhra wl pass yabda cripté
     
      const mailOption = {
          from : getconfig.from,
          to : "hadilmiladi37@gmail.com",
          subject : getconfig.subject,
          html: `<html>
      
          <body style="background-color:#e2e1e0;font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;color:#000;">
            <table style="max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);-moz-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); border-top: solid 10px green;">
              <thead>
                <tr>
                <th style="text-align:left;font-size:24px;font-family:Arial;">NEXUS</th> 
                </tr>
                <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                
                
                <td style="text-align:right;font-weight:bold;">
  FROM: 
</td>
<td>${new Date(globalInvoice.start).toISOString().split('T')[0]}</td>

                </tr>
                <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
               
                <td style="text-align:right;font-weight:bold;">TO: 
                </td>
                <td>${new Date(globalInvoice.end).toISOString().split('T')[0]}</td>
                </tr>
              

              
              </thead>
              <tbody>
                <tr>
                  <td style="height:35px;"></td>
                </tr>
                <tr>
                
                  <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;">
                    <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:150px">Client Adress</span><b style="color:green;font-weight:normal;margin:0">${/* JSON.stringify */(globalInvoice.client.address)}</b></p>
                    <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Company Name</span> ${(globalInvoice.client.company_name)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="height:35px;"></td>
                </tr>
                
                ${invoices.map((invoice, index) => {
                  const invoiceStartDate = new Date(invoice.start);
                  const invoiceEndDate = new Date(invoice.end);
                  const invoiceTimeDifference = Math.abs(invoiceEndDate - invoiceStartDate);
                  const invoiceNumberOfDays = Math.ceil(invoiceTimeDifference / (1000 * 60 * 60 * 24));
                  const subtotal = invoice?.mission?.planePrice + invoice?.mission?.hotelPrice + invoice?.mission?.employee?.rank?.perdiem * invoiceNumberOfDays;
    
                  totalAmount += subtotal; // Add the subtotal to the totalAmount
                  const destination = invoice?.mission?.destination;
                  console.log('Destination:', destination);
                  return `<tr><td style="width:50%;padding:20px;vertical-align:top">
                  <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px">#</span> ${index}</p>
                </td>
               <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Destination</span> ${destination}</p>
                </td>
               <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Employee</span>${invoice?.mission?.employee?.firstname} ${invoice?.mission?.employee?.lastname} </p>
               </td>
               <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Rank</span>${invoice?.mission?.employee?.rank?.perdiem} </p>
               </td>
               <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Plane</span>${invoice?.mission?.planePrice} </p>
               </td>
               <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Hotel</span>${invoice?.mission?.hotelPrice} </p>
               </td>
               <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Subtotal</span> <span className="fw-bold">
               ${invoice?.mission?.planePrice +
                 invoice?.mission?.hotelPrice +
                 invoice?.mission?.employee?.rank?.perdiem * invoiceNumberOfDays} $
             </span></p>
             </td>
             </tr>`;
      }).join('')}
      <tr>
      <td colspan="6" style="text-align: right;">
        <div style="border: 2px solid green; padding: 10px; display: inline-block;">
          <span className="fw-bold" style="font-size: 20px;">Total:</span>
          <span className="fw-bold" style="font-size: 24px;">${totalAmount} $</span>
        </div>
      </td>
    </tr>
    
    
                 
                
               
              </tbody>
              <tfooter>
              <tr>
              <td colspan="2" style="font-size:14px;padding:50px 15px 0 15px;">
                <strong style="display:block;margin:0 0 10px 0;">Regards</strong> Nexus Groupe<br> Lac 2 Tunis<br><br>
                <b>Phone:</b>70 860 870<br>
                <b>Email:</b> contact@nexusgroupe.com
              </td>
            </tr>
              </tfooter>
            </table>
          </body>
          
          </html>`
      }

      await transporter.sendMail(mailOption).then(()=>{
        console.log("1111111111&")
        console.log("&&&&&&&&&&&&&&&&&&&",getconfig.typeofmail)
        
       /*  console.log("all",getAll().from) */
        //return res.status(200).json({ globalInvoice });
      })
      
}

const sendMailOutlook = async ( globalInvoice, invoices) => {
  
  //
  invoices.forEach((invoice) => {
    console.log("Start:", invoice.start);
    console.log("Finish:", invoice.finish);
    console.log("Description:", invoice.mission.description);
  });
  
  let totalAmount = 0;
  const getconfig=await getAll()
      const transporter = nodemailer.createTransport({
        service:'outlook',
          
          auth: {
            
            user: getconfig.from,
            pass: getconfig.password
          }
        });
        //lezmou fi ecran config wahda okhra wl pass yabda cripté
        /* find where subject : "INVOICE", */
        
        
  
        const mailOption = {
            from : getconfig.from,
            to : "hadilmiladi37@gmail.com",
            subject : getconfig.subject,
            html: `<html>
        
            <body style="background-color:#e2e1e0;font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;color:#000;">
              <table style="max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);-moz-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); border-top: solid 10px green;">
                <thead>
                  <tr>
                  <th style="text-align:left;font-size:24px;font-family:Arial;">NEXUS</th> 
                  </tr>
                  <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  
                  
                  <td style="text-align:right;font-weight:bold;">
    FROM: 
  </td>
  <td>${new Date(globalInvoice.start).toISOString().split('T')[0]}</td>
  
                  </tr>
                  <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                 
                  <td style="text-align:right;font-weight:bold;">TO: 
                  </td>
                  <td>${new Date(globalInvoice.end).toISOString().split('T')[0]}</td>
                  </tr>
                
  
                
                </thead>
                <tbody>
                  <tr>
                    <td style="height:35px;"></td>
                  </tr>
                  <tr>
                  
                    <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;">
                      <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:150px">Client Adress</span><b style="color:green;font-weight:normal;margin:0">${/* JSON.stringify */(globalInvoice.client.address)}</b></p>
                      <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Company Name</span> ${(globalInvoice.client.company_name)}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="height:35px;"></td>
                  </tr>
                  
                  ${invoices.map((invoice, index) => {
                    const invoiceStartDate = new Date(invoice.start);
                    const invoiceEndDate = new Date(invoice.end);
                    const invoiceTimeDifference = Math.abs(invoiceEndDate - invoiceStartDate);
                    const invoiceNumberOfDays = Math.ceil(invoiceTimeDifference / (1000 * 60 * 60 * 24));
                    const subtotal = invoice?.mission?.planePrice + invoice?.mission?.hotelPrice + invoice?.mission?.employee?.rank?.perdiem * invoiceNumberOfDays;
      
                    totalAmount += subtotal; // Add the subtotal to the totalAmount
                    const destination = invoice?.mission?.destination;
                    console.log('Destination:', destination);
                    return `<tr><td style="width:50%;padding:20px;vertical-align:top">
                    <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px">#</span> ${index}</p>
                  </td>
                 <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Destination</span> ${destination}</p>
                  </td>
                 <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Employee</span>${invoice?.mission?.employee?.firstname} ${invoice?.mission?.employee?.lastname} </p>
                 </td>
                 <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Rank</span>${invoice?.mission?.employee?.rank?.perdiem} </p>
                 </td>
                 <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Plane</span>${invoice?.mission?.planePrice} </p>
                 </td>
                 <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Hotel</span>${invoice?.mission?.hotelPrice} </p>
                 </td>
                 <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Subtotal</span> <span className="fw-bold">
                 ${invoice?.mission?.planePrice +
                   invoice?.mission?.hotelPrice +
                   invoice?.mission?.employee?.rank?.perdiem * invoiceNumberOfDays} $
               </span></p>
               </td>
               </tr>`;
        }).join('')}
        <tr>
        <td colspan="6" style="text-align: right;">
          <div style="border: 2px solid green; padding: 10px; display: inline-block;">
            <span className="fw-bold" style="font-size: 20px;">Total:</span>
            <span className="fw-bold" style="font-size: 24px;">${totalAmount} $</span>
          </div>
        </td>
      </tr>
      
      
                   
                  
                 
                </tbody>
                <tfooter>
                  <tr>
                    <td colspan="2" style="font-size:14px;padding:50px 15px 0 15px;">
                      <strong style="display:block;margin:0 0 10px 0;">Regards</strong> Nexus Groupe<br> Lac 2 Tunis<br><br>
                      <b>Phone:</b>70 860 870<br>
                      <b>Email:</b> contact@nexusgroupe.com
                    </td>
                  </tr>
                </tfooter>
              </table>
            </body>
            
            </html>`
        }
  
        await transporter.sendMail(mailOption).then(()=>{
          console.log("1111111111&")
          
         /*  console.log("all",getAll().from) */
          //return res.status(200).json({ globalInvoice });
        })
        
  }
const createAnEmail= async(req,res)=>{
  try {
    const getconfig = await getAll();
    const length = Object.keys(getconfig).length;
    
    if (length === 0) {
      const { from, subject, typeofmail, password } = req.body;
      const createconfig = await db.mailconfig.create({
        from,
        subject,
        typeofmail,
        password
      });

      if (!createconfig) {
        return res.status(400).json({ error: "failed to create" });
      }

      return res.status(201).json({ message: "created successfully" });
    } else if (length !== 0) {
      await update(req, res);
    }
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "server error" });
  }
};


  const getAll = async () => {
    try {
        const mail = await db.mailconfig.findAll();
        if (!mail || mail.length === 0) {
            console.log('MailConfig not found');
            return null; 
        }
        return { ...mail[0].dataValues };
    } catch (error) {
        console.log("error: ", error);
        throw error;
    }
};
const deleteconfig = async(req, res) => {
  try {
      
      const deleteConfig = await db.mailconfig.destroy({
         where: {}, });
      if (!deleteConfig) {
          return res.status(400).json({ error: "failed to delete" })
      }
      // ==>
      return res.status(202).json({ message: "deleted successfully" })
  } catch (error) {
      console.log("erro: ", error)
      return res.status(500).json({ error: "server error" })
  }
}

const update= async(req,res)=>{
  try {
    const { from, subject, configname, typeofmail,body, password } = req.body;

    const updateconfig = await db.mailconfig.update(
      {
        from,
        subject,
        configname,
        typeofmail,
        body,
        password
      },
      { where: {} } 
    );

    if (!updateconfig) {
      return res.status(400).json({ error: "failed to update" });
    }

    return res.status(202).json({ message: "updated successfully" });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "server error" });
  }
};

  module.exports = {sendMailGmail,
    sendMailOutlook,
  createAnEmail,
getAll,
deleteconfig,
update};