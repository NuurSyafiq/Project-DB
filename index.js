const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const { createConnection } = require("mysql2/promise");

require("dotenv").config();

let app = express();
app.set("view engine", "hbs");
app.use(express.static("public")); 
app.use(express.urlencoded({ extended: false }));

wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

const helpers = require("handlebars-helpers"); 
helpers({
  handlebars: hbs.handlebars,
});

async function main() {
  const connection = await createConnection({  
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  });

  app.get("/", (req, res) => {
    res.render("home");
  });

  app.get("/shipment", async function (req, res) {
    const [shipment] = await connection.execute(`
      SELECT * FROM Shipments
      JOIN Handlers ON Shipments.handler_id = Handlers.handler_id;
    `);
    
    res.render("shipment", { shipment: shipment });
  });

  app.get("/shipment/add", async function (req, res) {
    const [handlers] = await connection.execute(`SELECT * FROM Handlers`);
    res.render("create-shipment", { handlers: handlers });
  });

  app.post("/shipment/add", async function (req, res) {
    try {
      const {
        tracking_number, origin, destination, weight, quantity, handler_id, status, shipment_date
      } = req.body;

      await connection.execute(`
        INSERT INTO Shipments (tracking_number, origin, destination, weight, quantity, handler_id, status, shipment_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `, [tracking_number, origin, destination, weight, quantity, handler_id, status, shipment_date]);

      res.redirect("/shipment");
    } catch (err) {
      console.error("Error adding shipment:", err);
      res.status(500).send("Failed to add shipment.");  
    }
  });

  app.get("/shipment/:shipment_id/delete", async function (req, res) {
    try {
      const shipmentId = req.params.shipment_id;
      const [results] = await connection.execute(`SELECT * FROM Shipments WHERE shipment_id = ?`, [shipmentId]);

      if (results.length === 0) {
        return res.status(404).send("Shipment not found.");
      }

      res.render("delete-shipment", { shipment: results[0] });
    } catch (e) {
      console.error("Error fetching shipment:", e);
      res.status(500).send("Unable to process delete."); 
    }
  });

  app.post("/shipment/:shipment_id/delete", async function (req, res) { 
    try {
      const shipmentId = req.params.shipment_id;
      await connection.execute(`DELETE FROM Shipments WHERE shipment_id = ?`, [shipmentId]);

      res.redirect("/shipment");
    } catch (e) {
      console.error("Error deleting shipment:", e);
      res.render("error", { errorMessage: "Unable to process delete. Contact admin or try again" });
    }
  }); 

  app.get('/shipment/:shipment_id/edit', async function (req, res) {
    try {
      const shipmentId = req.params.shipment_id;
      const [shipment] = await connection.execute("SELECT * FROM Shipments WHERE shipment_id = ?", [shipmentId]);

      if (shipment.length === 0) {
        return res.status(404).send("Shipment not found.");
      }

      const [handlers] = await connection.execute("SELECT * FROM Handlers");  

      res.render("update-shipment", {
        shipment: shipment[0],
        handlers: handlers, 
      });
    } catch (e) {
      console.error("Error fetching shipment for update:", e); 
      res.status(500).send("Error loading update form.");
    }
  });

  app.post('/shipment/:shipment_id/edit', async function (req, res) {
    try {
      const shipmentId = req.params.shipment_id;
      const {
        tracking_number, origin, destination, weight, quantity, handler_id, status, shipment_date
      } = req.body;

      await connection.execute(`
        UPDATE Shipments 
        SET tracking_number = ?, origin = ?, destination = ?, weight = ?, 
            quantity = ?, handler_id = ?, status = ?, shipment_date = ?
        WHERE shipment_id = ?;
      `, [
        tracking_number, origin, destination, weight, quantity, handler_id, status, shipment_date, shipmentId
      ]);

      res.redirect("/shipment");
    } catch (err) {
      console.error("Error updating shipment:", err);
      res.status(500).send("Error updating shipment.");
    } 
  });

}

main().catch(err => console.error("Error in main function:", err));

app.listen(3000, () => {
  console.log("Server is running"); 
});