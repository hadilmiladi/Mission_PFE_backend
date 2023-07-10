const nodemailer = require("nodemailer");

const sendMail = async ( globalInvoice, invoices) => {
//
invoices.forEach((invoice) => {
  console.log("Start:", invoice.start);
  console.log("Finish:", invoice.finish);
  console.log("Description:", invoice.mission.description);
});
let totalAmount = 0;
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: 'hadil.miladi@esprit.tn',
          pass: 'h1a2d3i4l5'
        }
      });
      
      const mailOption = {
          from : "NEXUS",
          to : "hadilmiladi37@gmail.com",
          subject : "INVOICE",
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
                    <strong style="display:block;margin:0 0 10px 0;">Regards</strong> Bachana Tours<br> Gorubathan, Pin/Zip - 735221, Darjeeling, West bengal, India<br><br>
                    <b>Phone:</b> 03552-222011<br>
                    <b>Email:</b> contact@bachanatours.in
                  </td>
                </tr>
              </tfooter>
            </table>
          </body>
          
          </html>`
      }

      await transporter.sendMail(mailOption).then(()=>{
        console.log("1111111111&")
        //return res.status(200).json({ globalInvoice });
      })
      
}

  module.exports = {sendMail};