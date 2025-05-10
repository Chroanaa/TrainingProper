import React, { useState, useEffect } from "react";
import { fetchPOIS } from "../../firebase/POI/fetchPOIS";
import { NavLink } from "react-router-dom";
import { deletePOI } from "../../firebase/POI/deletePOI";
import DeleteDialog from "../components/ui/DeleteDialog";
import { 
  Button,
  Paper,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Tooltip,
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function TrainingList() {
  const [fetchedDocuments, setFetchedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);

  useEffect(() => {
    const unsubscribe = fetchPOIS((data) => {
      setFetchedDocuments(data);
      setLoading(false);
    });
    
    // Cleanup function
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleOpenDeleteDialog = (id) => {
    setSelectedDocId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedDocId(null);
  };

  const handleDelete = async () => {
    if (!selectedDocId) return;
    
    try {
      await deletePOI(selectedDocId);
      console.log("Document deleted successfully");
      // No need to manually update the fetchedDocuments array as the listener should update it
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      handleCloseDeleteDialog();
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Training Documents
        </Typography>
        
      </Box>

      {fetchedDocuments.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No training documents available
          </Typography>
          <Typography variant="body1" mt={1}>
            Click "Create New" to add your first training document.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {fetchedDocuments.map((document) => (
            <Grid item xs={12} sm={6} md={4} key={document.id}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {document.title}
                  </Typography>
                  {document.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {document.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    component={NavLink}
                    to={`/List/${document.id}`}
                    size="small" 
                    color="primary"
                    startIcon={<VisibilityIcon />}
                  >
                    View
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleOpenDeleteDialog(document.id)}
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
        title="Delete Training Document"
        item="document"
      />
    </Container>
  );
}

export default TrainingList;