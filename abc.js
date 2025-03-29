const handleSendSummaryEmail = async (item) => {
  try {
    console.log("Sending summary email for CID:", item.cid_id);
    const response = await apiClient.post(`/${item.cid_id}/send-cid_summary_email`);
    if (response?.data?.success) {
      alert(`Summary email sent successfully for CID ${item.cid_id}`);
    } else {
      throw new Error(response?.data?.message || "Failed to send summary email");
    }
  } catch (error) {
    console.error("Error sending summary email:", error);
    alert(error.message || "Failed to send summary email");
  }
};
