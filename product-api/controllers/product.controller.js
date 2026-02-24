const Product = require("../models/product.model");
const generateSlug = require("../utils/slug");
const { Op } = require("sequelize");

exports.createProduct = async (req, res) => {
  try {
    const { title, price } = req.body;

    // Validate required
    if (!title || !price) {
      return res.status(400).json({ message: "Title và Price không được để trống" });
    }

    // Validate price number
    if (isNaN(price)) {
      return res.status(400).json({ message: "Price phải là số" });
    }

    const slug = generateSlug(title);

    const product = await Product.create({
      title,
      slug,
      price
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, minPrice, maxPrice } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ message: "page phải là số nguyên dương" });
    }

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: "limit phải là số nguyên dương" });
    }

    if (minPrice && maxPrice && parseFloat(maxPrice) < parseFloat(minPrice)) {
      return res.status(400).json({ message: "maxPrice không được nhỏ hơn minPrice" });
    }

    const where = {};

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ where: { slug } });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};