import pool from "../config/database.js";

// ✅ Create a new CID entry
export const createCID = async (cidData) => {
  const query = `
    INSERT INTO cid 
    (product_id, prev_rev, next_rev, change_notice, supplier_id, rework_or_not, OTS_or_not, sending_date, closing_date, note) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;

  const values = [
    cidData.product_id,
    cidData.prev_rev,
    cidData.next_rev,
    cidData.change_notice,
    cidData.supplier_id,
    cidData.rework_or_not,
    cidData.OTS_or_not,
    cidData.sending_date,
    cidData.closing_date,
    cidData.note,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get all CIDs
export const getAllCIDs = async () => {
  const query = "SELECT * FROM cid ORDER BY cid_id ASC"; // return object { row: [{name: "hieu", age: 17}, {name: "tung", age:13}]}
  const { rows } = await pool.query(query);
  return rows;
};

// ✅ Get a CID by ID
export const getCIDById = async (cidId) => {
  const query = "SELECT * FROM cid WHERE cid_id = $1";
  const { rows } = await pool.query(query, [cidId]);
  return rows[0];
};

// ✅ Update a CID entry
export const updateCID = async (cidId, updatedFields) => {
  const fields = Object.keys(updatedFields)  // extract keys from object and return them as an array- ex : ["name", "age", "city"]
    .map((key, index) => `${key} = $${index + 1}`) // ["name = $1", "age = $2", "city = $3"]
    .join(", "); // "name = $1, age = $2, city = $3"
  const values = Object.values(updatedFields);  // ["New Name", 30, "Hanoi"]

  const query = `UPDATE cid SET ${fields} WHERE cid_id = $${values.length + 1} RETURNING *`;

  const { rows } = await pool.query(query, [...values, cidId]);
  return rows[0];
};

// ✅ Delete a CID entry
export const deleteCID = async (cidId) => {
  const query = "DELETE FROM cid WHERE cid_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [cidId]);
  return rows[0];
};


----------------------------------------

import {
    createCID,
    getAllCIDs,
    getCIDById,
    updateCID,
    deleteCID
  } from "../models/cid.model.js";
  
import { getCIDTasksByCID } from "../models/cid_task.model.js";
import { sendEmail } from "../utils/emailService.js";

  // ✅ Get all CID entries
  export const getCIDs = async (req, res) => {
    try {
      const cids = await getAllCIDs();
      res.status(200).json(cids);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // ✅ Get a CID by ID
  export const getCID = async (req, res) => {
    try {
      const cid = await getCIDById(req.params.id);
      if (!cid) return res.status(404).json({ message: "CID entry not found" });
  
      res.status(200).json(cid);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // ✅ Create a new CID entry
  export const addCID = async (req, res) => {
    try {
      const { product_id, next_rev, sending_date } = req.body;
  
      // Validate required fields
      if (!product_id || !next_rev || !sending_date) {
        return res.status(400).json({ message: "Product ID, next revision, and sending date are required" });
      }
  
      const cid = await createCID(req.body);
      res.status(201).json({ message: "CID entry created successfully", cid });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // ✅ Update a CID entry
  export const editCID = async (req, res) => {
    try {
      const updatedCID = await updateCID(req.params.id, req.body);
      if (!updatedCID) return res.status(404).json({ message: "CID entry not found" });
  
      res.status(200).json({ message: "CID entry updated successfully", updatedCID });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // ✅ Delete a CID entry
  export const removeCID = async (req, res) => {
    try {
      const deletedCID = await deleteCID(req.params.id);
      if (!deletedCID) return res.status(404).json({ message: "CID entry not found" });
  
      res.status(200).json({ message: "CID entry deleted successfully", deletedCID });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

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
