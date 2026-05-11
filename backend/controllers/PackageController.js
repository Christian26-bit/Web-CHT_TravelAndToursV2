const { Package } = require("../models");
const { Op } = require("sequelize");

exports.listPackages = async (req, res) => {
  try {
    const { q } = req.query;
    let where = { IsActive: true };

    if (q) {
      where[Op.and] = [
        { IsActive: true },
        {
          [Op.or]: [
            { Name: { [Op.like]: `%${q}%` } },
            { Destination: { [Op.like]: `%${q}%` } },
          ],
        },
      ];
    }

    const packages = await Package.findAll({
      where,
      order: [["PackageID", "DESC"]],
    });

    res.json({ success: true, data: packages });
  } catch (error) {
    console.error("List Packages Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

exports.savePackage = async (req, res) => {
  try {
    const {
      PackageID,
      Name,
      Destination,
      Duration,
      MaxPax,
      Price,
      IsActive,
      Description,
      Inclusions,
    } = req.body;

    if (!Name || !Price) {
      return res
        .status(400)
        .json({ success: false, error: "Name and Price are required." });
    }

    if (PackageID) {
      const pkg = await Package.findByPk(PackageID);
      if (!pkg)
        return res
          .status(404)
          .json({ success: false, error: "Package not found." });

      await pkg.update({
        Name,
        Destination,
        Duration,
        MaxPax,
        Price,
        IsActive,
        Description,
        Inclusions,
      });
      res.json({ success: true, message: "Package updated.", data: pkg });
    } else {
      const newPkg = await Package.create({
        Name,
        Destination,
        Duration,
        MaxPax,
        Price,
        IsActive,
        Description,
        Inclusions,
      });
      res.json({ success: true, message: "Package created.", data: newPkg });
    }
  } catch (error) {
    console.error("Save Package Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};
