const { as } = require("pg-promise");
const supabase = require("./db");
const router = require("express").Router();
const axios = require("axios");

async function getFarmerServiceUrl() {
  try {
    let serviceRegisterUrl =
      String(process.env.serviceRegistryUrl) + "/get-service";
    response = await axios.post(serviceRegisterUrl, {
      name: process.env.FarmerServiceName,
    });
    // console.log(response.data);

    if (response.data.success) {
      return response.data.url;
    } else {
      console.log(response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error recovering farmer-data", error);
    return null;
  }
}

async function getSmeServiceUrl() {
  try {
    let serviceRegisterUrl =
      String(process.env.serviceRegistryUrl) + "/get-service";
    response = await axios.post(serviceRegisterUrl, {
      name: process.env.SmeServiceName,
    });
    // console.log(response.data);

    if (response.data.success) {
      return response.data.url;
    } else {
      console.log(response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error recovering sme-data", error);
    return null;
  }
}

async function getVendorServiceUrl() {
  try {
    let serviceRegisterUrl =
      String(process.env.serviceRegistryUrl) + "/get-service";
    response = await axios.post(serviceRegisterUrl, {
      name: process.env.VendorServiceName,
    });
    // console.log(response.data);

    if (response.data.success) {
      return response.data.url;
    } else {
      console.log(response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error recovering vendor-data", error);
    return null;
  }
}

async function getAgentServiceUrl() {
  try {
    let serviceRegisterUrl =
      String(process.env.serviceRegistryUrl) + "/get-service";
    response = await axios.post(serviceRegisterUrl, {
      name: process.env.AgentServiceName,
    });
    // console.log(response.data);

    if (response.data.success) {
      return response.data.url;
    } else {
      console.log(response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error recovering agent-data", error);
    return null;
  }
}

// {id: 123 }
router.post("/farmer", async (req, res) => {
  let farmerServiceUrl = await getFarmerServiceUrl();

  if (farmerServiceUrl) {
    try {
      let farmerTransactionHistoryUrl = farmerServiceUrl + "/buy/history";
      let farmerTransactionHistory = await axios.post(
        farmerTransactionHistoryUrl,
        req.body
      );
      res.send(farmerTransactionHistory.data);
    } catch (error) {
      console.error("Error getting farmer transaction history", error);
      res
        .status(500)
        .send({ message: "Error getting farmer transaction history" });
    }
  }
});

// {id: 123 }
router.post("/vendor", async (req, res) => {
  let vendorServiceUrl = await getVendorServiceUrl();

  if (vendorServiceUrl) {
    try {
      let vendorTransactionHistoryUrl = vendorServiceUrl + "/sell/history";
      let vendorTransactionHistory = await axios.post(
        vendorTransactionHistoryUrl,
        req.body
      );
      res.send(vendorTransactionHistory.data);
    } catch (error) {
      console.error("Error getting vendor transaction history", error);
      res
        .status(500)
        .send({ message: "Error getting vendor transaction history" });
    }
  }
});

// {id: 123}
router.post("/sme", async (req, res) => {
  let smeServiceUrl = await getSmeServiceUrl();

  if (smeServiceUrl) {
    try {
      let smeSellHistoryUrl = smeServiceUrl + "/sell/history";
      let smeSellHistory = await axios.post(smeSellHistoryUrl, req.body);

      let smeBuyHistoryUrl = smeServiceUrl + "/buy/history";
      let smeBuyHistory = await axios.post(smeBuyHistoryUrl, req.body);

      let response = {
        sellHistory: smeSellHistory.data,
        buyHistory: smeBuyHistory.data,
      };
    } catch (error) {
      console.error("Error getting sme transaction history", error);
      res
        .status(500)
        .send({ message: "Error getting sme transaction history" });
    }
  }
});

module.exports = router;
