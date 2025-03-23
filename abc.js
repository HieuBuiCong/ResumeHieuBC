<Tooltip
  title={
    column === "part_number" && productData
      ? getProductTooltip(dataItem[column])
      : dataItem[column]?.toString() || ""
  }
  arrow
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
