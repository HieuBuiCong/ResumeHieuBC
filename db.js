export const sendCIDSummaryEmail = async (req, res) => {
  try {
    const { cid_id } = req.params;

    // 1) Fetch CID & Product Details
    const cidQuery = `
      SELECT
        c.cid_id, c.prev_rev, c.next_rev, c.status, c.deadline,
        p.product_id, p.part_number, p.part_name, p.model, p.owner
      FROM cid c
      LEFT JOIN product p ON c.product_id = p.product_id
      WHERE c.cid_id = $1;
    `;
    const { rows: cidRows } = await pool.query(cidQuery, [cid_id]);
    if (cidRows.length === 0) {
      return res.status(404).json({ success: false, message: "CID not found" });
    }
    const cidDetails = cidRows[0];

    // 2) Fetch CID Tasks
    const taskQuery = `
      SELECT
        ct.cid_task_id, ct.task_category_id, tc.task_name,
        u.username AS assignee_name, u.email AS assignee_email,
        ct.status, ct.deadline
      FROM cid_task ct
      JOIN users u ON ct.assignee_id = u.user_id
      JOIN task_category tc ON ct.task_category_id = tc.task_category_id
      WHERE ct.cid_id = $1;
    `;
    const { rows: taskRows } = await pool.query(taskQuery, [cid_id]);

    // 3) Reference Emails
    const refQuery = `SELECT email FROM reference_email_list;`;
    const { rows: refEmails } = await pool.query(refQuery);
    const referenceEmailList = refEmails.map(r => r.email);

    const taskAssigneeEmails = taskRows.map(task => task.assignee_email);
    const uniqueRecipients = [...new Set([...taskAssigneeEmails, ...referenceEmailList])];

    if (uniqueRecipients.length === 0) {
      return res.status(400).json({ success: false, message: "No recipients found." });
    }

    // 4) Fetch attachments
    const attachmentQuery = `SELECT file_name, file_path FROM attachments WHERE cid_id = $1`;
    const { rows: attachments } = await pool.query(attachmentQuery, [cid_id]);

    const attachmentLinks = attachments.length
      ? `
        <ul>
          ${attachments.map(att => `
            <li><a href="${process.env.BASE_URL}/${att.file_path}" target="_blank">${att.file_name}</a></li>
          `).join('')}
        </ul>
      `
      : `<p>No attachments for this CID.</p>`;

    // 5) Task Table HTML
    const taskTableHtml = taskRows.length
      ? `
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            ${taskRows.map(task => `
              <tr>
                <td>${task.task_name}</td>
                <td>${task.assignee_name}</td>
                <td>${task.status}</td>
                <td>${task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `
      : `<p>No tasks available for this CID.</p>`;

    // 6) Email Content
    const subject = `📌 CID #${cidDetails.cid_id} - Summary Report`;

    const content = `
      <p>Hello,</p>
      <p>Here is the summary of CID <strong>#${cidDetails.cid_id}</strong>.</p>

      <h3>🔹 CID Details:</h3>
      <ul>
        <li><strong>CID ID:</strong> ${cidDetails.cid_id}</li>
        <li><strong>Previous Revision:</strong> ${cidDetails.prev_rev}</li>
        <li><strong>Next Revision:</strong> ${cidDetails.next_rev}</li>
        <li><strong>Status:</strong> ${cidDetails.status}</li>
        <li><strong>Deadline:</strong> ${cidDetails.deadline ? new Date(cidDetails.deadline).toLocaleDateString() : "N/A"}</li>
      </ul>

      <h3>🔹 Product Details:</h3>
      <ul>
        <li><strong>Part Number:</strong> ${cidDetails.part_number}</li>
        <li><strong>Part Name:</strong> ${cidDetails.part_name}</li>
        <li><strong>Model:</strong> ${cidDetails.model}</li>
        <li><strong>Owner:</strong> ${cidDetails.owner}</li>
      </ul>

      <h3>🔹 Task Overview:</h3>
      ${taskTableHtml}

      <h3>📎 Attached Files:</h3>
      ${attachmentLinks}

      <p>Best regards,<br>Your System</p>
    `;

    // 7) Send Email
    await sendEmail(uniqueRecipients.join(","), subject, content, true);

    console.log(`📧 CID Summary email sent for CID #${cid_id} to:`, uniqueRecipients);

    res.status(200).json({
      success: true,
      message: `CID Summary email sent successfully.`,
      recipients: uniqueRecipients,
    });

  } catch (emailError) {
    console.error("❌ Error sending CID summary email:", emailError);
    res.status(500).json({ success: false, message: `Failed to send CID summary email: ${emailError.message}` });
  }
};