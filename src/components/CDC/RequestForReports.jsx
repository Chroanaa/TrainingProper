import React from "react"
import CustomTabPanel from "../ui/CustomTabPanel";
import { Button, Checkbox,Box,FormLabel,FormGroup,FormControlLabel} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../ui/Loading";
function RequestForReports({value, index}) {
  const [state, setState] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });

  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData()
    form.append("attendance", state.attendance);
    form.append("inventory", state.inventory);
    form.append("grades", state.grades);
    try{
      setLoading(true);
      const response =  await axios.post("http://localhost/backend/notifyDepartmentsEmail.php",form)
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Email sent successfully!",
        });
        setLoading(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to send email.",
        });
        setLoading(false);
      }
       
    }catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <CustomTabPanel value={value} index={index}>
      <Button onClick={handleSubmit}>Notify Departments</Button>
      <Box>
        <h1>Request For Reports</h1>
        <FormLabel component="legend">Select Departments</FormLabel>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} onChange={handleChange} label="Attendance Report" name="attendance" />
          <FormControlLabel control={<Checkbox />} onChange={handleChange} label="Inventory Report" name="inventory" />
          <FormControlLabel control={<Checkbox />} onChange={handleChange} label="Grades Report" name = "grades"/>
        </FormGroup>
      </Box>
      <Loading
       show={loading}
       text={"Sending Request"}
      />
    </CustomTabPanel>
  );

}
export default RequestForReports;