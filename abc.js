import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  TextField,
  Divider,
  DialogContentText,
  Tooltip
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { makeStyles } from "@mui/styles";
import { useNotification } from "../../context/NotificationContext";
import { fetchPostponeHistory, requestPostpone, reviewPostpone } from "../../services/postponeService";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: "#347928",
    color: theme.palette.common.white,
  },
  dialogContent: {
    padding: theme.spacing(2),
    backgroundColor: "#FFFBE6",
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  select: {
    marginBottom: theme.spacing(2),
  },
}));

const PostponeHistoryModal = ({ open, onClose, task, refreshData, isAdmin }) => {
  const classes = useStyles();
  const { showNotification } = useNotification();

  // State Management
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [decision, setDecision] = useState("approve");
  const [reviewReason, setReviewReason] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [requestReason, setRequestReason] = useState("");

  const [reviewOpen, setReviewOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  // Fetch Postpone History
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchPostponeHistory(task.cid_task_id);
        if (response?.data) {
          setHistory(response.data);
          const pendingRequest = response.data.find((item) => item.status === "pending");
          setPendingRequest(pendingRequest);
        } else {
          throw new Error("Failed to fetch postpone history.");
        }
      } catch (error) {
        console.error("Error fetching postpone history:", error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, task.cid_task_id]);

  // ✅ Handle Submit Request for Extension
  const handleRequestSubmit = async () => {
    try {
      if (!requestReason.trim() || !proposedDate) {
        return showNotification("Reason and proposed date are required.", "error");
      }

      setLoading(true);
      const response = await requestPostpone(task.cid_task_id, requestReason, proposedDate);

      if (response?.data?.success) {
        showNotification("Extension request submitted successfully!", "success");
        setRequestOpen(false);
        refreshData();
      } else {
        throw new Error(response?.data?.message || "Failed to submit request.");
      }
    } catch (error) {
      console.error("Request Submit Error:", error);
      showNotification(error.message || "Failed to submit request.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Admin Review (Approve/Reject)
  const handleReviewSubmit = async () => {
    try {
      if (!reviewReason.trim()) {
        return showNotification("Review reason is required.", "error");
      }

      setLoading(true);
      const response = await reviewPostpone(pendingRequest.cid_task_id, decision, reviewReason);

      if (response?.data?.success) {
        showNotification(`Request ${decision} successfully!`, "success");
        setReviewOpen(false);
        refreshData();
      } else {
        throw new Error(response?.data?.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Review Submit Error:", error);
      showNotification(error.message || "Failed to submit review.", "error");
    } finally {
      setLoading(false);
    }
  };
