import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getAllATR } from "../../firebase/getAllATR";
import { deleteATR } from "../../firebase/deleteATR";
import { useNavigate } from "react-router";
function TrainingReport() {
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState("");
  const [poi, setPoi] = React.useState([]);
  const handleChange = (event) => {
    setFilter(event.target.value);
  };
  React.useEffect(() => {
    const unsubscribe = getAllATR((data) => {
      setPoi(data);
    });
  }, []);
  const handleClickView = (id) => {
    navigate(`/TrainingReport/${id}`);
  };
  const handleDelete = (id) => {
    deleteATR(id)
      .then(() => {
        console.log("ATR deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting ATR:", error);
      });
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
          <MenuItem value={"all"}>All</MenuItem>
          <MenuItem value={"weekly"}>Weekly</MenuItem>
          <MenuItem value={"monthly"}>Monthly</MenuItem>
          <MenuItem value={"yearly"}>Yearly</MenuItem>
        </Select>
      </FormControl>
      {poi.map((item, index) => (
        <Box
          key={index}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "16px",
            margin: "8px 0",
          }}
        >
          <h3>{item.title}</h3>
          <button onClick={() => handleClickView(item.id)}>view</button>
          <button onClick={() => handleDelete(item.id)}>delete</button>
        </Box>
      ))}
    </div>
  );
}

export default TrainingReport;
