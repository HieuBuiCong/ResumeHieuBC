const handleSubmit = async () => {
  try {
    setLoading(true);
    setConfirmOpen(false);
    const response = await taskSubmit(task.cid_task_id);

    // ✅ Handle Task Submission Notification
    if (response?.data?.taskSubmitted) {
      showNotification("Task submitted successfully!", "success");
    } else {
      showNotification("Task submission failed", "error");
      return; // Exit early if submission failed
    }

    // ✅ Handle Email Notification with Delay
    setTimeout(() => {
      if (response?.data?.emailSent) {
        showNotification("Email notification sent successfully!", "success");
      } else {
        showNotification("Failed to send email notification.", "warning");
      }
    }, 3000);

    onClose();

  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Failed to submit answers.";
    showNotification(errorMessage, "error");
  } finally {
    setLoading(false);
  }
};
