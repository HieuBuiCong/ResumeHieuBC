{/* VIEW MODE */}
<Tooltip
  title={
    column === "part_number" && productData
      ? (
        <div style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
          {(() => {
            const product = productData.find(p => p.part_number === dataItem[column]);
            return product ? (
              <>
                <div><strong>Product ID:</strong> {product.product_id}</div>
                <div><strong>Part Number:</strong> {product.part_number}</div>
                <div><strong>Part Name:</strong> {product.part_name}</div>
              </>
            ) : (
              "No product info available"
            );
          })()}
        </div>
      )
      : (dataItem[column]?.toString() || "")
  }
  arrow
  placement="top"
  componentsProps={{
    tooltip: {
      sx: {
        fontSize: "0.9rem",
        padding: "12px",
        backgroundColor: "#333",
        color: "#fff",
        borderRadius: "6px",
        whiteSpace: "normal",
      },
    },
  }}
>
  <span>
    {typeof dataItem[column] === "boolean" ? (
      dataItem[column] ? (
        <CheckIcon sx={{ color: "green" }} />
      ) : (
        <ClearIcon sx={{ color: "red" }} />
      )
    ) : column.toLowerCase().includes("date") || column === "deadline" ? (
      format(new Date(dataItem[column]), "dd-MMM-yy")
    ) : column.toLowerCase() === "status" ? (
      <span
        style={{
          padding: "2px 8px",
          borderRadius: "12px",
          backgroundColor:
            statusColors[dataItem[column]?.toLowerCase()] || "#ddd",
          color: "#fff",
          fontWeight: 500,
          fontSize: "0.8rem",
          textTransform: "capitalize",
        }}
      >
        {dataItem[column]}
      </span>
    ) : (
      dataItem[column]
    )}
  </span>
</Tooltip>