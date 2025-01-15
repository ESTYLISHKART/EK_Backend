const Category = require("../models/category.model");
const Product = require("../models/product.model");

// Create a new product
async function createProduct(reqData) {
  let topLevel = await Category.findOne({ name: reqData.topLavelCategory });

  if (!topLevel) {
    const topLavelCategory = new Category({
      name: reqData.topLavelCategory,
      level: 1,
    });

    topLevel = await topLavelCategory.save();
  }

  let secondLevel = await Category.findOne({
    name: reqData.secondLavelCategory,
    parentCategory: topLevel._id,
  });

  if (!secondLevel) {
    const secondLavelCategory = new Category({
      name: reqData.secondLavelCategory,
      parentCategory: topLevel._id,
      level: 2,
    });

    secondLevel = await secondLavelCategory.save();
  }

  let thirdLevel = await Category.findOne({
    name: reqData.thirdLavelCategory,
    parentCategory: secondLevel._id,
  });

  if (!thirdLevel) {
    const thirdLavelCategory = new Category({
      name: reqData.thirdLavelCategory,
      parentCategory: secondLevel._id,
      level: 3,
    });

    thirdLevel = await thirdLavelCategory.save();
  }

  const product = new Product({
    title: reqData.title,
    description: reqData.description,
    price: reqData.price,
    discountedPrice: reqData.discountedPrice,
    discountPercent: reqData.discountPercent,
    quantity: reqData.quantity,
    brand: reqData.brand,
    colors: reqData.colors,
    sizes: reqData.sizes,
    imageUrl: reqData.imageUrl,
    imageALL: reqData.imageALL,
    category: thirdLevel._id,
  });

  const savedProduct = await product.save();
  console.log("Saved Product:", savedProduct);
  const category = await Category.findById(savedProduct.category);
  console.log("Category of Created Product:", category);

  return savedProduct;
}
// Delete a product by ID
async function deleteProduct(productId) {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("product not found with id - : ", productId);
  }

  await Product.findByIdAndDelete(productId);

  return "Product deleted Successfully";
}

// Update a product by ID
async function updateProduct(productId, reqData) {
  const updatedProduct = await Product.findByIdAndUpdate(productId, reqData, {
    new: true,
  });
  return updatedProduct;
}

// Find a product by ID
async function findProductById(id) {
  const product = await Product.findById(id).populate("category").exec();

  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
}

// Get all products with filtering and pagination
// async function getAllProducts(reqQuery) {
//   // Destructure the query parameters with defaults
//   // let {
//   //   category,
//   //   colors,
//   //   sizes,
//   //   minPrice,
//   //   maxPrice,
//   //   minDiscount,
//   //   sort,
//   //   stock,
//   //   pageNumber = 1,
//   //   pageSize = 10,
//   // } = reqQuery;

//   // try {
//   //   // Initialize the query with the base product model and populate the category
//   //   let query = Product.find().populate("category");

//   //   // Filter by category
//   //   if (category) {
//   //     const existCategory = await Category.findOne({ name: category }).exec();
//   //     if (existCategory) {
//   //       query = query.where("category").equals(existCategory._id);
//   //     } else {
//   //       // If the category doesn't exist, return an empty result set
//   //       return { content: [], currentPage: 1, totalPages: 1 };
//   //     }
//   //   }

//   //   // Filter by colors
//   //   if (colors) {
//   //     const colorSet = new Set(
//   //       colors.split(",").map((color) => color.trim().toLowerCase())
//   //     );
//   //     if (colorSet.size > 0) {
//   //       const colorRegex = new RegExp([...colorSet].join("|"), "i");
//   //       query = query.where("colors").regex(colorRegex);
//   //     }
//   //   }

//   //   // Filter by sizes
//   //   if (sizes) {
//   //     const sizesSet = new Set(
//   //       sizes.split(",").map((size) => size.trim().toLowerCase())
//   //     );
//   //     query = query.where("sizes.name").in([...sizesSet]);
//   //   }

//   //   // Filter by price range
//   //   if (minPrice && maxPrice) {
//   //     query = query
//   //       .where("discountedPrice")
//   //       .gte(Number(minPrice))
//   //       .lte(Number(maxPrice));
//   //   } else if (minPrice) {
//   //     query = query.where("discountedPrice").gte(Number(minPrice));
//   //   } else if (maxPrice) {
//   //     query = query.where("discountedPrice").lte(Number(maxPrice));
//   //   }

//   //   // Filter by minimum discount
//   //   if (minDiscount) {
//   //     query = query.where("discountPersent").gte(Number(minDiscount));
//   //   }

//   //   // Filter by stock status
//   //   if (stock) {
//   //     if (stock === "in_stock") {
//   //       query = query.where("quantity").gt(0);
//   //     } else if (stock === "out_of_stock") {
//   //       query = query.where("quantity").lte(0);
//   //     }
//   //   }

//   //   // Sorting
//   //   if (sort) {
//   //     const sortOptions = {
//   //       price_low: { discountedPrice: 1 },
//   //       price_high: { discountedPrice: -1 },
//   //       newest: { createdAt: -1 },
//   //     };
//   //     query = query.sort(sortOptions[sort] || {});
//   //   }

//   //   // Total products count for pagination
//   //   const totalProducts = await Product.countDocuments(query.clone());

//   //   // Pagination
//   //   const skip = (pageNumber - 1) * pageSize;
//   //   query = query.skip(skip).limit(Number(pageSize));

//   //   // Execute the query
//   //   const products = await query.exec();

//   //   // Calculate total pages
//   //   const totalPages = Math.ceil(totalProducts / pageSize);

//   //   // Return the response
//   //   return {
//   //     content: products,
//   //     currentPage: Number(pageNumber),
//   //     totalPages: totalPages || 1,
//   //   };
//   // } catch (error) {
//   //   console.error("Error in getAllProducts:", error);
//   //   throw new Error("Error fetching products.");
//   // }

//   let query = Product.find();
//   const products = await query.exec();
//   console.log("Products:", products);
//   console.log(query.getQuery());

//   return products;
// }

async function getAllProducts(reqQuery) {
  const {
    category,
    colors,
    sizes,
    minPrice = 0,
    maxPrice = 1000000,
    minDiscount = 0,
    sort = "price_low",
    stock,
    pageNumber = 1,
    pageSize = 10,
  } = reqQuery;

  try {
    // Initialize the query with the base product model
    let query = Product.find().populate("category");

    // Filter by category
    if (category) {
      const existCategory = await Category.findOne({ name: category }).exec();
      if (existCategory) {
        query = query.where("category").equals(existCategory._id);
      } else {
        return { content: [], currentPage: 1, totalPages: 1 };
      }
    }

    // Filter by colors
    if (colors) {
      const colorSet = new Set(colors.split(",").map((color) => color.trim()));
      if (colorSet.size > 0) {
        const colorRegex = new RegExp([...colorSet].join("|"), "i");
        query = query.where("colors").regex(colorRegex);
      }
    }

    // Filter by sizes
    if (sizes) {
      const sizesSet = new Set(sizes.split(",").map((size) => size.trim()));
      query = query.where("sizes.name").in([...sizesSet]);
    }

    // Filter by price range
    query = query
      .where("discountedPrice")
      .gte(Number(minPrice))
      .lte(Number(maxPrice));

    // Filter by minimum discount
    if (minDiscount) {
      query = query.where("discountPersent").gte(Number(minDiscount));
    }

    // Filter by stock
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    }

    // Sorting
    const sortOptions = {
      price_low: { discountedPrice: 1 },
      price_high: { discountedPrice: -1 },
      newest: { createdAt: -1 },
    };
    query = query.sort(sortOptions[sort] || {});

    // Pagination
    const totalProducts = await Product.countDocuments(query.clone());
    const skip = (pageNumber - 1) * pageSize;
    query = query.skip(skip).limit(Number(pageSize));

    // Execute the query
    const products = await query.exec();

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / pageSize);

    // Return paginated results
    return {
      content: products,
      currentPage: Number(pageNumber),
      totalPages: totalPages || 1,
      totalElements: totalProducts,
    };
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    throw new Error("Error fetching products.");
  }
}

async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}

async function searchProducts(query, filter = {}, options = {}) {
  try {
    const { priceMin, priceMax, brand, category } = filters;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const filterQuery = {
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { brand: { $regex: query, $options: "i" } },
            { "colors.name": { $regex: query, $options: "i" } },
          ],
        },
      ],
    };

    // Apply filters
    if (priceMin) filterQuery.$and.push({ price: { $gte: priceMin } });
    if (priceMax) filterQuery.$and.push({ price: { $lte: priceMax } });
    if (brand) filterQuery.$and.push({ brand });
    if (category) filterQuery.$and.push({ category });

    // Pagination
    const skip = (page - 1) * limit;

    // Sorting
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const products = await Product.find(filterQuery)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(
        "title description price discountedPrice brand imageUrl colors category"
      );

    const totalProducts = await Product.countDocuments(filterQuery);

    return {
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
  searchProducts,
};
