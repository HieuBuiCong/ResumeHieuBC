  // conditionally define tooltip helper
  const getProductTooltip = (partNumber) => {
    if (!productData) return "";
    const product = productData.find(p => p.part_number === partNumber);
    return product 
      ? `Product ID: ${product.product_id}\nPart Number: ${product.part_number}\nPart Name: ${product.part_name}` 
      : "No product info available";
  };
