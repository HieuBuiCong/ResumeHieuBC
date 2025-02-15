import { getCIDById } from "../models/cid.model.js";
import { getCIDTasksByCID } from "../models/cid_task.model.js";
import { sendEmail } from "../utils/emailService.js";

// ✅ Send a summary email for a specific CID
export const sendSpecificCIDSummaryEmail = async (req, res) => {
  try {
    const { cid_id, optionalEmails } = req.body; // Get CID ID and optional email recipients

    // Fetch CID details
    const cid = await getCIDById(cid_id);
    if (!cid) {
      return res.status(404).json({ message: `CID with ID ${cid_id} not found.` });
    }

    // Fetch tasks related to this CID
    const cidTasks = await getCIDTasksByCID(cid_id);

    // ✅ Construct email content with HTML table
    let emailBody = `
      <h2>🚀 CID Summary Report - CID #${cid.cid_id}</h2>
      <p>
        <strong>Model:</strong> ${cid.model} <br>
        <strong>Part Number:</strong> ${cid.part_number} <br>
        <strong>Owner:</strong> ${cid.owner || "N/A"} <br>
        <strong>Sending Date:</strong> ${cid.sending_date} <br>
        <strong>Status:</strong> ${cid.status}
      </p>
    `;

    if (cidTasks.length) {
      emailBody += `
        <h3>📌 Tasks for CID #${cid.cid_id}</h3>
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

      cidTasks.forEach(task => {
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

    // ✅ Get assigned user emails dynamically (Replace with DB query)
    const assignedUserEmails = ["user1@example.com", "user2@example.com"]; // Mocked for now

    // ✅ Combine assigned users and optional emails
    const recipientEmails = [...assignedUserEmails, ...(optionalEmails || [])];

    // ✅ Send email with HTML formatting
    await sendEmail(
      recipientEmails.join(", "), // Send to all recipients
      `📌 CID Summary Report - CID #${cid.cid_id}`,
      emailBody,
      true // Send as HTML
    );

    res.status(200).json({ message: `📧 CID Summary Email Sent for CID #${cid.cid_id} Successfully!` });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
