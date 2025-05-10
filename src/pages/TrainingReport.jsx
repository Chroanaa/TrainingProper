import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getAllATR } from "../../firebase/ATR/getAllATR";
import { deleteATR } from "../../firebase/ATR/deleteATR";
import DeleteDialog from "../components/ui/DeleteDialog";
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Divider,
  Paper,
  Stack,
  CircularProgress,
  Tooltip,
  IconButton
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { format } from "date-fns";

function TrainingReport() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get("filter") || "all");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    const unsubscribe = getAllATR((data) => {
      setReports(data);
      setLoading(false);
    });
    
    // Cleanup function
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);
    setSearchParams({ filter: value });
  };

  const handleClickView = (id) => {
    navigate(`/TrainingReport/${id}`);
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedReportId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedReportId(null);
  };

  const handleDelete = async () => {
    if (!selectedReportId) return;
    
    try {
      await deleteATR(selectedReportId);
      console.log("ATR deleted successfully");
    } catch (error) {
      console.error("Error deleting ATR:", error);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const filterData = () => {
    if (filter === "weekly") {
      return reports.filter(
        (item) => new Date(item.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    } else if (filter === "monthly") {
      return reports.filter(
        (item) => new Date(item.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
    } else if (filter === "yearly") {
      return reports.filter(
        (item) => new Date(item.date) >= new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      );
    }
    return reports;
  };

  const getFilteredData = filterData();

  const formatDate = (date) => {
    if (!date) return "No date";
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return format(dateObj, "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" display="flex" alignItems="center">
          <AssessmentIcon sx={{ mr: 1, fontSize: 32 }} />
          Training Reports
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <FilterListIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6">Filter Reports</Typography>
        </Box>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="filter-select-label">Time Period</InputLabel>
          <Select
            labelId="filter-select-label"
            id="filter-select"
            value={filter}
            label="Time Period"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All Reports</MenuItem>
            <MenuItem value="weekly">Last 7 Days</MenuItem>
            <MenuItem value="monthly">Last 30 Days</MenuItem>
            <MenuItem value="yearly">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {getFilteredData.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No training reports available for the selected period
          </Typography>
          <Typography variant="body1" mt={1}>
            Try selecting a different time period or create new training reports.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {getFilteredData.map((report) => (
            <Grid item xs={12} md={6} key={report.id}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {report.title}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <EventIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(report.date)}
                    </Typography>
                  </Stack>
                  
                  {report.instructor && (
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Instructor: {report.instructor}
                      </Typography>
                    </Stack>
                  )}
                  
                  {report.description && (
                    <Typography 
                      variant="body2" 
                      sx={{
                        mt: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {report.description}
                    </Typography>
                  )}
                </CardContent>
                
                <Divider />
                
                <CardActions>
                  <Button
                    startIcon={<VisibilityIcon />}
                    size="small"
                    color="primary"
                    onClick={() => handleClickView(report.id)}
                  >
                    View Details
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    size="small"
                    color="error"
                    onClick={() => handleOpenDeleteDialog(report.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDelete}
        title="Delete Training Report"
        item="report"
      />
    </Container>
  );
}

export default TrainingReport;