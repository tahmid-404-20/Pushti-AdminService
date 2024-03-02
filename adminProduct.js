const supabase = require("./db");
const router = require("express").Router();
const axios = require("axios");

async function getProductMsUrl() {
  try {
    let serviceRegisterUrl =
      String(process.env.serviceRegistryUrl) + "/get-service";
    response = await axios.post(serviceRegisterUrl, {
      name: process.env.productMsName,
    });
    // console.log(response.data);

    if (response.data.success) {
      return response.data.url;
    } else {
      console.log(response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error recovering product-data", error);
    return null;
  }
}

router.post("/get-products", async (req, res) => {
  let productMsUrl = await getProductMsUrl();
  if (productMsUrl) {
    try {
      let productsUrl = productMsUrl + "/product";
      let products = await axios.get(productsUrl);
      res.send(products.data);
    } catch (error) {
      console.error("Error getting products", error);
      res.status(500).send("Error getting products");
    }
  } else {
    res.status(500).send("Error getting product-ms url");
  }
});

// {name, unit, unit_price, tax_amount, image_link}
router.post("/add-product", async (req, res) => {
    let productMsUrl = await getProductMsUrl();
    if (productMsUrl) {
        try {
        let addProductUrl = productMsUrl + "/product/add";
        let response = await axios.post(addProductUrl, req.body);
        res.send(response.data);
        } catch (error) {
        console.error("Error adding product", error);
        res.status(500).send("Error adding product");
        }
    } else {
        res.status(500).send("Error getting product-ms url");
    }
    });

// {id, unit_price, tax_amount}
router.post("/update-product", async (req, res) => {
  let productMsUrl = await getProductMsUrl();
  if (productMsUrl) {
    try {
      let updateProductUrl = productMsUrl + "/product/update";
      let response = await axios.post(updateProductUrl, req.body);
      res.send(response.data);
    } catch (error) {
      console.error("Error updating product", error);
      res.status(500).send("Error updating product");
    }
  } else {
    res.status(500).send("Error getting product-ms url");
  }
});

module.exports = router;
