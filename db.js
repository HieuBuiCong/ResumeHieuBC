import { getAllCIDs } from "../models/cid.model.js";
import { getAllCIDTasks } from "../models/cid_task.model.js";
import { sendEmail } from "../utils/emailService.js";

// ✅ Send a summary email of all CID & CID_Tasks (Formatted in a table)
export const sendCIDSummaryEmail = async (req, res) => {
  try {
    const { optionalEmails } = req.body; // Optional recipients from frontend

    // Fetch all CIDs and CID_Tasks
    const cids = await getAllCIDs();
    const cidTasks = await getAllCIDTasks();

    if (!cids.length) {
      return res.status(400).json({ message: "No CIDs available to send." });
    }

    // ✅ Construct email content with HTML table
    let emailBody = `
      <h2>🚀 CID Summary Report</h2>
      <p><strong>Total CIDs:</strong> ${cids.length}</p>
    `;

    cids.forEach((cid) => {
      emailBody += `
        <h3>🔹 CID #${cid.cid_id}</h3>
        <p>
          <strong>Model:</strong> ${cid.model} <br>
          <strong>Part Number:</strong> ${cid.part_number} <br>
          <strong>Owner:</strong> ${cid.owner || "N/A"} <br>
          <strong>Sending Date:</strong> ${cid.sending_date} <br>
          <strong>Status:</strong> ${cid.status}
        </p>
      `;

      const tasksForCID = cidTasks.filter(task => task.cid_id === cid.cid_id);
      if (tasksForCID.length) {
        emailBody += `
          <table border="1" cellspacing="0" cellpadding="5">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
        `;

        tasksForCID.forEach(task => {
          emailBody += `
            <tr>
              <td>${task.task_name}</td>
              <td>${task.username}</td>
              <td>${task.status_name}</td>
              <td>${task.deadline}</td>
            </tr>
          `;
        });

        emailBody += `</tbody></table><br>`;
      } else {
        emailBody += `<p>No tasks assigned yet.</p>`;
      }
    });

    // ✅ Get assigned user emails dynamically (Replace with DB query)
    const assignedUserEmails = ["user1@example.com", "user2@example.com"]; // Mocked for now

    // ✅ Combine assigned users and optional emails
    const recipientEmails = [...assignedUserEmails, ...(optionalEmails || [])];

    // ✅ Send email with HTML formatting
    await sendEmail(
      recipientEmails.join(", "), // Send to all recipients
      "📌 CID Summary Report",
      emailBody,
      true // Send as HTML
    );

    res.status(200).json({ message: "📧 CID Summary Email Sent Successfully!" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
