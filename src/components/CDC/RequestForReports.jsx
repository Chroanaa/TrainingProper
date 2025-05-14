import React from "react"
import CustomTabPanel from "../ui/CustomTabPanel";
import { Button, Checkbox,Box,FormLabel,FormGroup,FormControlLabel} from "@mui/material";
import axios from "axios";
function RequestForReports({value, index}) {
  const [state, setState] = React.useState({});
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
      const response =  await axios.post("http://localhost/backend/notifyDepartmentsEmail.php",form)
      console.log(response.data);
    }catch (error) {
      console.error("Error sending request:", error);
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
    </CustomTabPanel>
  );

}
export default RequestForReports;