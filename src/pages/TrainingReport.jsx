import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
function TrainingReport() {
  const [filter, setFilter] = React.useState("");
  const handleChange = (event) => {
    setFilter(event.target.value);
  };
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-label'>Filter</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={filter || ""}
          label='Filter'
          onChange={handleChange}
        >
          <MenuItem value={"weekly"}>Weekly</MenuItem>
          <MenuItem value={"monthly"}>Monthly</MenuItem>
          <MenuItem value={"yearly"}>Yearly</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default TrainingReport;
