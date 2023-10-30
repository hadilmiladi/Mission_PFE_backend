const nodemailer = require("nodemailer");
const db = require("../models");
const {getAll} = require ("./mailing-controller")

const sendMissionGmail = async (mission) => {
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
              subject : "about your mission",
              html: `<html>

              <head>
                  <style>
                      body {
                          background-color: #e2e1e0;
                          font-family: Open Sans, sans-serif;
                          font-size: 100%;
                          font-weight: 400;
                          line-height: 1.4;
                          color: #000;
                      }
              
                      table {
                          max-width: 670px;
                          margin: 50px auto 10px;
                          background-color: #fff;
                          padding: 50px;
                          border-radius: 3px;
                          box-shadow: 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24);
                          border-top: solid 10px green;
                      }
                  </style>
              </head>
              
              <body>
                  <table>
                      <thead>
                          <tr>
                              <th style="text-align: left; font-size: 24px; font-family: Arial;">NEXUS</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td class="modal-body px-sm-2 pb-2">
                                  <div class="info-container">
                                      <ul class="list-unstyled">
                                          <li class="mb-75">
                                          <span style="font-weight: bold; margin-right: 5px;">Client :</span>
                                              <span class="text-capitalize">${mission.client.company_name}</span>
                                          </li>
                                          <li class="mb-75">
                                          <span style="font-weight: bold; margin-right: 5px;">Start Date :</span>
                                              <span class="text-capitalize">${String(mission.start).slice(0, 10)}</span>
                                          </li>
                                          <li class="mb-75">
                                              <span style="font-weight: bold; margin-right: 5px;">Finish Date :</span>
                                              <span class="text-capitalize">${String(mission.finish).slice(0, 10)}</span>
                                          </li>
                                          <li class="mb-75">
                                              <span style="font-weight: bold; margin-right: 5px;">Destination :</span>
                                              <span class="text-capitalize">${mission.destination}</span>
                                          </li>
                                          <li class="mb-75">
                                              <span style="font-weight: bold; margin-right: 5px;">Hotel Link :</span>
                                              <a target='_blank' href="${mission.hotelLink}">${mission.hotelLink}</a>
                                          </li>
                                          <li class="mb-75">
                                              <span style="font-weight: bold; margin-right: 5px;">Plane Code :</span>
                                              <span class="text-capitalize">${mission.planeId}</span>
                                          </li>
                                          <li class="mb-75">
                                              <span style="font-weight: bold; margin-right: 5px;">Plane Link :</span>
                                              <a target='_blank' href="${mission.planeLink}">${mission.planeLink}</a>
                                          </li>
                                          <li class="mb-75">
                                              <span style="font-weight: bold; margin-right: 5px;">Description :</span>
                                              <span class="text-capitalize">${mission.description}</span>
                                          </li>
                                      </ul>
                                  </div>
                              </td>
                          </tr>
                      </tbody>
                      <tfoot>
                      <tr>
                      <td colspan="2" style="font-size:14px;padding:50px 15px 0 15px;">
                        <strong style="display:block;margin:0 0 10px 0;">Regards</strong> Nexus Groupe<br> Lac 2 Tunis<br><br>
                        <b>Phone:</b>70 860 870<br>
                        <b>Email:</b> contact@nexusgroupe.com
                      </td>
                    </tr>
                      </tfoot>
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
    
    const sendMissionOutlook = async (mission) => {
      
      const getconfig=await getAll()
          const transporter = nodemailer.createTransport({
            service:'outlook',
              
              auth: {
                
                user: getconfig.from,
                pass: getconfig.password
              }
            });
            const mailOption = {
                from : getconfig.from,
                to : "hadilmiladi37@gmail.com",
                subject : "about your mission",
                html: `<html>

                <head>
                    <style>
                        body {
                            background-color: #e2e1e0;
                            font-family: Open Sans, sans-serif;
                            font-size: 100%;
                            font-weight: 400;
                            line-height: 1.4;
                            color: #000;
                        }
                
                        table {
                            max-width: 670px;
                            margin: 50px auto 10px;
                            background-color: #fff;
                            padding: 50px;
                            border-radius: 3px;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24);
                            border-top: solid 10px green;
                        }
                    </style>
                </head>
                
                <body>
                    <table>
                        <thead>
                            <tr>
                                <th style="text-align: left; font-size: 24px; font-family: Arial;">NEXUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="modal-body px-sm-2 pb-2">
                                    <div class="info-container">
                                        <ul class="list-unstyled">
                                            <li class="mb-75">
                                                <span class="fw-bolder me-25">#:</span>
                                                <span class="text-capitalize">${mission.id}</span>
                                            </li>
                                            <li class="mb-75">
                                                <span class="fw-bolder me-25">Client :</span>
                                                <span class="text-capitalize">${mission.client.company_name}</span>
                                            </li>
                                            <li class="mb-75">
                                                <span class="fw-bolder me-25">Start Date :</span>
                                                <span class="text-capitalize">${String(mission.start).slice(0, 10)}</span>
                                            </li>
                                            <li class="mb-75">
                                                <span class="fw-bolder me-25">Finish Date :</span>
                                                <span class="text-capitalize">${String(mission.finish).slice(0, 10)}</span>
                                            </li>
                                            <li class="mb-75">
                                                <span class="fw-bolder me-25">Destination :</span>
                                                <span class="text-capitalize">${mission.destination}</span>
                                            </li>
                                            <li class="mb-75">
                                                <span class="fw-bolder me-25">Hotel Link :</span>
                                                <a target='_blank' href="${mission.hotelLink}">${mission.hotelLink}</a>
                                            </li>
                                            <li class="mb-75">
                                                <span class="fw-bolder me-25">Plane Code :</span>
                                                <span class="text-capitalize">${mission.planeId}</span>
                                            </li>
                                            <li class="mb-75">
                                                <span class="fw-bolder me-25">Plane Link :</span>
                                                <a target='_blank' href="${mission.planeLink}">${mission.planeLink}</a>
                                            </li>
                                            <li class="mb-75">
                                                <span class="fw-bolder me-25">Description :</span>
                                                <span class="text-capitalize">${mission.description}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                        <td colspan="2" style="font-size:14px;padding:50px 15px 0 15px;">
                          <strong style="display:block;margin:0 0 10px 0;">Regards</strong> Nexus Groupe<br> Lac 2 Tunis<br><br>
                          <b>Phone:</b>70 860 870<br>
                          <b>Email:</b> contact@nexusgroupe.com
                        </td>
                      </tr>
                        </tfoot>
                    </table>
                </body>
                
                </html>`
            }
      
            await transporter.sendMail(mailOption).then(()=>{
              console.log("1111111111&")
            })
            
      }
      module.exports={
        sendMissionGmail,
        sendMissionOutlook
      }