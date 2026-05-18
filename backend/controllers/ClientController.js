const { Client, Employee } = require("../models");
const { Op } = require("sequelize");

exports.listClients = async (req, res) => {
  try {
    const { q } = req.query;
    let where = {};

    if (q) {
      where = {
        [Op.or]: [
          { Name: { [Op.like]: `%${q}%` } },
          { Email: { [Op.like]: `%${q}%` } },
        ],
      };
    }

    const clients = await Client.findAll({
      where,
      include: [
        {
          model: Employee,
          as: "AccountManager",
          attributes: ["Name", "Email"],
        }
      ],
      order: [["clientId", "DESC"]],
    });

    res.json({ success: true, data: clients });
  } catch (error) {
    console.error("List Clients Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

exports.saveClient = async (req, res) => {
  try {
    const { clientId, name, email, address, contactNumber, customerType } =
      req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, error: "Name and email are required." });
    }

    if (clientId) {
      const client = await Client.findByPk(clientId);
      if (!client)
        return res
          .status(404)
          .json({ success: false, error: "Client not found." });

      await client.update({
        name,
        email,
        address,
        contactNumber,
        customerType,
      });
      res.json({
        success: true,
        message: "Client updated successfully.",
        data: client,
      });
    } else {
      const newClient = await Client.create({
        name,
        email,
        address,
        contactNumber,
        customerType,
        dateRegistered: new Date(),
      });
      res.json({
        success: true,
        message: "Client created successfully.",
        data: newClient,
      });
    }
  } catch (error) {
    console.error("Save Client Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};
