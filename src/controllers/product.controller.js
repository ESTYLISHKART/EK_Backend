// productController.js
const productService = require("../services/product.service.js");

// Create a new product
async function createProduct(req, res) {
  try {
    const productData = req.body;

    // Validate colors array if provided
    if (productData.colors) {
      if (!Array.isArray(productData.colors)) {
        return res.status(400).json({ error: "'colors' must be an array." });
      }

      for (const color of productData.colors) {
        if (!color.name || !color.imageUrl) {
          return res.status(400).json({
            error: "Each color must have a 'name' and 'imageUrl'.",
          });
        }
      }
    }

    if (productData.sizes) {
      if (!Array.isArray(productData.sizes)) {
        return res.status(400).json({ error: "'sizes' must be an array." });
      }

      for (const size of productData.sizes) {
        if (!size.name || size.quantity === undefined) {
          return res.status(400).json({
            error: "Each size must have a 'name' and 'quantity'.",
          });
        }
      }
    }

    const product = await productService.createProduct(productData);
    console.log(product);
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Delete a product by ID
async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;
    const message = await productService.deleteProduct(productId);
    return res.json({ message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update a product by ID
async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    // Validate colors array if provided
    if (updateData.colors) {
      if (!Array.isArray(updateData.colors)) {
        return res.status(400).json({ error: "'colors' must be an array." });
      }

      for (const color of updateData.colors) {
        if (!color.name || !color.imageUrl) {
          return res.status(400).json({
            error: "Each color must have a 'name' and 'imageUrl'.",
          });
        }
      }
    }

    if (updateData.sizes) {
      if (!Array.isArray(updateData.sizes)) {
        return res.status(400).json({ error: "'sizes' must be an array." });
      }

      for (const size of updateData.sizes) {
        if (!size.name || size.quantity === undefined) {
          return res.status(400).json({
            error: "Each size must have a 'name' and 'quantity'.",
          });
        }
      }
    }

    const updatedProduct = await productService.updateProduct(
      productId,
      updateData
    );
    return res.json(updatedProduct);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get all products
// async function getAllProducts(req, res) {
//   try {
//     const products = await productService.getAllProducts();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// Find a product by ID
async function findProductById(req, res) {
  try {
    const productId = req.params.id;
    const product = await productService.findProductById(productId);
    return res.status(200).send(product);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

// Find products by category
async function findProductByCategory(req, res) {
  try {
    const category = req.params.category;
    const products = await productService.findProductByCategory(category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all products with filtering and pagination
async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts(req.query);

    return res.status(200).send(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

const createMultipleProduct = async (req, res) => {
  try {
    await productService.createMultipleProduct(req.body);
    res
      .status(202)
      .json({ message: "Products Created Successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Search products by query
async function searchProduct(req, res) {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const products = await productService.searchProduct(query);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  findProductByCategory,
  searchProduct,
  createMultipleProduct,
};
