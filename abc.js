const handleSubmit = async () => {
  try {
    setLoading(true);
    setConfirmOpen(false);

    const response = await taskSubmit(task.cid_task_id);

    console.log("API Response:", response?.data); // Debugging

    // ✅ Check for the correct response format
    if (response?.data?.success) {
      if (response?.data?.taskSubmitted) {
        showNotification("Task submitted successfully!", "success");
      } else {
        showNotification("Task submission failed.", "error");
        return; // Stop here if submission failed
      }

      // ✅ Handle Email Notification with a delay
      setTimeout(() => {
        if (response?.data?.emailSent) {
          showNotification("Email notification sent successfully!", "success");
        } else {
          showNotification("Failed to send email notification.", "warning");
        }
      }, 3000);

      onClose();
    } else {
      throw new Error(response?.data?.message || "Task submission failed.");
    }

  } catch (error) {
    console.error("Submission Error:", error);
    const errorMessage = error?.response?.data?.message || error.message || "Failed to submit answers.";
    showNotification(errorMessage, "error");
  } finally {
    setLoading(false);
  }
};
