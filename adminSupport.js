const supabase = require("./db");
const router = require("express").Router();
const axios = require("axios");

async function getSupportMsUrl() {
  try {
    let serviceRegisterUrl =
      String(process.env.serviceRegistryUrl) + "/get-service";
    response = await axios.post(serviceRegisterUrl, {
      name: process.env.supportMsName,
    });
    // console.log(response.data);

    if (response.data.success) {
      return response.data.url;
    } else {
      console.log(response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error recovering support-data", error);
    return null;
  }
}

router.post("/inbox", async (req, res) => {
  let supportMsUrl = await getSupportMsUrl();

  if (supportMsUrl) {
    try {
      let farmerMessagesUrl = supportMsUrl + "/get-tickets/farmer";
      let farmerTickets = await axios.get(farmerMessagesUrl);

      let vendorMessagesUrl = supportMsUrl + "/get-tickets/vendor";
      let vendorTickets = await axios.get(vendorMessagesUrl);

      let smeMessagesUrl = supportMsUrl + "/get-tickets/sme";
      let smeTickets = await axios.get(smeMessagesUrl);

      let agentMessageUrl = supportMsUrl + "/get-tickets/agent";
      let agentTickets = await axios.get(agentMessageUrl);

      let response = {
        farmerTickets: farmerTickets.data,
        vendorTickets: vendorTickets.data,
        smeTickets: smeTickets.data,
        agentTickets: agentTickets.data,
      };

      res.send(response);
    } catch (error) {
      console.error("Error getting tickets", error);
      res.status(500).send("Error getting tickets");
    }
  } else {
    res.status(500).send("Error getting support-ms url");
  }
});

router.post("update-ticket/make-read", async (req, res) => {
  let supportMsUrl = await getSupportMsUrl();

  if (supportMsUrl) {
    try {
      let updateTicketUrl = supportMsUrl + "/update-ticket/make-read";
      let response = await axios.post(updateTicketUrl, {
        ticketId: req.body.ticketId,
      });

      res.send(response.data);
    } catch (error) {
      console.error("Error updating ticket", error);
      res.status(500).send("Error updating ticket");
    }
  } else {
    res.status(500).send("Error getting support-ms url");
  }
});

router.post("update-ticket/update-status", async (req, res) => {
  let supportMsUrl = await getSupportMsUrl();

  if (supportMsUrl) {
    try {
      let updateTicketUrl = supportMsUrl + "/update-ticket/update-status";
      let response = await axios.post(updateTicketUrl, {
        ticketId: req.body.ticketId,
        status: req.body.status,
      });

      res.send(response.data);
    } catch (error) {
      console.error("Error updating ticket", error);
      res.status(500).send("Error updating ticket");
    }
  } else {
    res.status(500).send("Error getting support-ms url");
  }
});

module.exports = router;
