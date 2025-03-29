const handleSendSummaryEmail = async (item) => {
  try {
    setLoading(true);

    const response = await fetch('/api/send-summary-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item[identifierKey] }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to send summary email");
    }

    const result = await response.json();
    setSuccess(true);
    setSuccessMessage(`Summary email sent successfully for ${item[itemLabelKey]}`);
    console.log("Email sent:", result);

  } catch (error) {
    console.error("Error sending summary email:", error);
    setLocalError(error.message || "Failed to send summary email");
  } finally {
    setLoading(false);
    setMenuAnchor(null); // Close the menu after action
  }
};
