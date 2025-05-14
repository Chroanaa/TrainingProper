import React from "react"
import CustomTabPanel from "../ui/CustomTabPanel";
import { Button } from "@mui/material";

function RequestForReports({value, index}) {
  return (
    <CustomTabPanel value={value} index={index}>
      <Button>Notify Departments</Button>
    </CustomTabPanel>
  );

}
export default RequestForReports;