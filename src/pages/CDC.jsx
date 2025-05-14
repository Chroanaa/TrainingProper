import React from "react";
import CDCtabs from "../components/CDC/CDCtabs";
import RequestForReports from "../components/CDC/RequestForReports";
import SendExcuseLetter from "../components/CDC/SendExcuseLetter";
function CDC(){
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return(
        <>
        <CDCtabs value={value} handleChange={handleChange} />
        <RequestForReports value={value} index={0} />
        <SendExcuseLetter value={value} index={1} />
        
        </>

    )
}
export default CDC;