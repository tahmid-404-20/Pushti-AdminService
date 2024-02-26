const supabase = require("./db");
const router = require("express").Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    let basicResponse = await supabase.any(
      `select "name", "email", "phone", "avatarLink", "permanentAddress", "dob" from "User" where "id" = $1;`,
      [req.body.id]
    );

    let basicData = basicResponse[0];

    let countSummaryResponse = await supabase.any(
      `select
      (
        select
          count(*)
        from
          "Farmer"
      ) as "totalFarmers",
      (
        select
          count(*)
        from
          "Sme"
      ) as "totalSmes",
      (
        select
          count(*)
        from
          "Vendor"
      ) as "totalVendors";`
    );
    
    let countSummary = countSummaryResponse[0];
    const responseObject = { basicData, countSummary };

    res.status(200).json(responseObject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
