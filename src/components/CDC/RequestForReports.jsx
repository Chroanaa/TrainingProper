import React from "react";
import CustomTabPanel from "../ui/CustomTabPanel";
import { 
  Button, 
  Checkbox, 
  Box, 
  FormLabel, 
  FormGroup, 
  FormControlLabel, 
  Paper, 
  Typography, 
  Divider,
  Card, 
  CardContent,
  Grid,
  Alert,
  Fade
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../ui/Loading";

function RequestForReports({ value, index }) {
  const [state, setState] = React.useState({
    attendance: false,
    inventory: false,
    grades: false
  });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const atLeastOneSelected = Object.values(state).some(value => value === true);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!atLeastOneSelected) {
      Swal.fire({
        icon: "warning",
        title: "No Selection",
        text: "Please select at least one report type."
      });
      return;
    }
    
    const form = new FormData();
    form.append("attendance", state.attendance);
    form.append("inventory", state.inventory);
    form.append("grades", state.grades);
    
    try {
      setLoading(true);
      const response = await axios.post("http://localhost/backend/notifyDepartmentsEmail.php", form);
      
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Email notification sent successfully!",
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to send email notification.",
        });
      }
    } catch (error) {
      console.error("Error sending request:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while sending the notification.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomTabPanel value={value} index={index}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          maxWidth: 800,
          mx: "auto",
          mb: 4
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom 
          color="primary"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          Request Departmental Reports
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {success && (
          <Fade in={success}>
            <Alert 
              severity="success" 
              sx={{ mb: 3 }}
            >
              Report request successfully sent to departments!
            </Alert>
          </Fade>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="textSecondary">
              Select the reports you need from departments:
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <FormGroup>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel 
                        control={
                          <Checkbox 
                            checked={state.attendance || false} 
                            onChange={handleChange}
                            color="primary"
                            size="medium"
                          />
                        } 
                        label={
                          <Typography variant="body1">
                            Attendance Report
                          </Typography>
                        } 
                        name="attendance" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel 
                        control={
                          <Checkbox 
                            checked={state.inventory || false} 
                            onChange={handleChange}
                            color="primary"
                            size="medium"
                          />
                        } 
                        label={
                          <Typography variant="body1">
                            Inventory Report
                          </Typography>
                        } 
                        name="inventory" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel 
                        control={
                          <Checkbox 
                            checked={state.grades || false} 
                            onChange={handleChange}
                            color="primary"
                            size="medium"
                          />
                        } 
                        label={
                          <Typography variant="body1">
                            Grades Report
                          </Typography>
                        } 
                        name="grades"
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={!atLeastOneSelected || loading}
              sx={{ 
                minWidth: 200,
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Send Notification
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Loading
        show={loading}
        text={"Sending notification to departments..."}
      />
    </CustomTabPanel>
  );
}

export default RequestForReports;