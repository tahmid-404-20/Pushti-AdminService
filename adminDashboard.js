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

    let responseStatArray = await supabase.any(
      `           
      select
        sum("totalFarmerLoan") as "totalFarmerLoan",
        sum("totalBuy") as "totalBuy",
        sum("totalSell") as "totalSell",
        sum("totalTax") as "totalTax",
        sum("totalSmeLoan") as "totalSmeLoan",
        sum("availableBudget") as "availableBudget"
      from
        "Division";;`
  );

  let generalStats = responseStatArray[0];
    
    let countSummary = countSummaryResponse[0];
    const responseObject = { basicData, countSummary, generalStats };

    res.status(200).json(responseObject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
