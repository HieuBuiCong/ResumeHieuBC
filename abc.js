import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  DialogContentText,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNotification } from "../../context/NotificationContext";
import { getPostponeHistory, submitExtensionRequest, approveOrRejectExtension } from "../../services/postponeService";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: "#3f51b5",
    color: theme.palette.common.white,
  },
  dialogContent: {
    padding: theme.spacing(2),
    backgroundColor: "#f0f4f8",
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  select: {
    marginBottom: theme.spacing(2),
  },
}));

const PostponeHistoryModal = ({ open, onClose, task, isAdmin, refreshData }) => {
  const classes = useStyles();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  // For submitting extension request
  const [reason, setReason] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For admin approval or rejection
  const [decision, setDecision] = useState("approve");
  const [approvalReason, setApprovalReason] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getPostponeHistory(task.cid_task_id);
        setHistory(response?.data || []);
      } catch (error) {
        setError(error?.message || "Failed to fetch postpone history.");
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchHistory();
  }, [open, task.cid_task_id]);

  // ✅ Submit Extension Request (User)
  const handleSubmitExtension = async () => {
    try {
      setIsSubmitting(true);
      const response = await submitExtensionRequest(task.cid_task_id, reason, proposedDate);
      showNotification(response?.data?.message || "Extension request submitted.", "success");
      onClose();
      refreshData();
    } catch (error) {
      showNotification(error?.response?.data?.message || "Failed to submit extension request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle Admin Decision (Approve or Reject)
  const handleReviewSubmit = async () => {
    try {
      setLoading(true);
      const response = await approveOrRejectExtension(task.cid_task_id, decision, approvalReason);
      showNotification(response?.data?.message || "Extension request reviewed.", "success");
      onClose();
      refreshData();
    } catch (error) {
      showNotification(error?.response?.data?.message || "Failed to review extension request.", "error");
    } finally {
      setLoading(false);
    }
  };
};
