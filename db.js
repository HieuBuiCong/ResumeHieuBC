import {
  createCID,
  getAllCIDs,
  getCIDById,
  updateCID,
  deleteCID
} from "../models/cid.model.js";

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
