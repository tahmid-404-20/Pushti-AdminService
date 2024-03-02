const supabase = require("./db");
const router = require("express").Router();
const axios = require("axios");

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

async function getLeaderboardMsUrl() {
  try {
    let serviceRegisterUrl =
      String(process.env.serviceRegistryUrl) + "/get-service";
    response = await axios.post(serviceRegisterUrl, {
      name: process.env.leaderboardMsName,
    });
    // console.log(response.data);

    if (response.data.success) {
      return response.data.url;
    } else {
      console.log(response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error recovering leaderboard-data", error);
    return null;
  }
}

// get the agentDashboard data
// req.body: {union_id: 123}
router.post("/union", async (req, res) => {
  let agentServiceUrl = await getAgentServiceUrl();

  if (agentServiceUrl) {
    try {
      let union_id = req.body.union_id;

      let responseAgentId = await supabase.any(
        `select
                a.id as agentId
              from
                "User" u
                join "Agent" a on u.id = a.id
              where
                u."unionId" = $1;`,
        [union_id]
      );

      let agentDashboardUrl = agentServiceUrl + "/dashboard";
      let agentDashboardData = await axios.get(agentDashboardUrl);

      let response = {
        agentDashboardData: agentDashboardData.data,
      };

      res.send(response);
    } catch (error) {
      console.error("Error getting tickets", error);
      res.status(500).send("Error getting tickets");
    }
  } else {
    res.status(500).send("Error getting agent-ms url");
  }
});

// req.body = {upazilla_id: 123}
router.post("/upazilla", async (req, res) => {
  let leaderboardMsUrl = await getLeaderboardMsUrl();

  if (leaderboardMsUrl) {
    try {
      let upazilla_id = req.body.upazilla_id;
      let responseStatArray = await supabase.any(
        `select "name", "totalFarmerLoan", "totalBuy", "totalSell", "totalTax",
             "totalSmeLoan", "availableBudget", "points" from "Upazilla" where "id" = $1;`,
        [upazilla_id]
      );

      let upazillaStats = responseStatArray[0];

      let upazillaLeaderboardUrl = leaderboardMsUrl + "/union";
      let upazillaLeaderboard = await axios.post(upazillaLeaderboardUrl, {
        upazilla_id: upazilla_id,
      });

      let response = {
        upazillaStats: upazillaStats,
        upazillaLeaderboard: upazillaLeaderboard.data,
      };

      res.send(response);
    } catch (error) {
      console.error("Error getting tickets", error);
      res.status(500).send("Error getting tickets");
    }
  } else {
    res.status(500).send("Error getting leaderboard-ms url");
  }
});

module.exports = router;
