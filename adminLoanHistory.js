const supabase = require("./db");
const router = require("express").Router();
const axios = require("axios");

async function getLoanMsUrl() {
  try {
    let serviceRegisterUrl =
      String(process.env.serviceRegistryUrl) + "/get-service";
    response = await axios.post(serviceRegisterUrl, {
      name: process.env.loanMsName,
    });
    // console.log(response.data);

    if (response.data.success) {
      return response.data.url;
    } else {
      console.log(response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error recovering loan-data", error);
    return null;
  }
}

// req.body: {id: 123, userType: "farmer"}
router.post("/get-loans", async (req, res) => {
  let loanMsUrl = await getLoanMsUrl();
  if (loanMsUrl) {
    try {
      let userType = req.body.userType;

      if (userType == "farmer") {
        let farmerLoanHistoryUrl = loanMsUrl + "/loan_history/farmer-admin";

        const req_body = { farmer_id: req.body.id };
        let farmerLoans = await axios.post(farmerLoanHistoryUrl, req_body);
        res.send(farmerLoans.data);
      } else if (userType == "sme") {
        let smeLoanHistoryUrl = loanMsUrl + "/loan_history/sme-admin";
        const req_body = { sme_id: req.body.id };
        let smeLoans = await axios.post(smeLoanHistoryUrl, req_body);
        res.send(smeLoans.data);
      } else {
        res.send({"message": `Invalid userType. Must be 'farmer' or 'sme'`});
      }
    } catch (error) {
      console.error("Error getting loans", error);
      res.status(500).send("Error getting loans");
    }
  } else {
    res.status(500).send("Error getting loan-ms url");
  }
});

module.exports = router;
