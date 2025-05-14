import React from "react";
import CustomTabPanel from "../ui/CustomTabPanel";
import { Button } from "@mui/material";

function SendExcuseLetter({ value, index }) {
    return (
        <CustomTabPanel value={value} index={index}>
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1>Send Excuse Letter For late submission of reports</h1>
            <label htmlFor="Subject">Subject:</label>
            <input type="text" />
            <label htmlFor="Message">Message:</label>
            <textarea name="Message" id="Message" cols="30" rows="10"></textarea>
            <label htmlFor="Attachment">Attachment:</label>
            <input type="file" />
            <Button variant="contained">Send</Button>

        </div>
        </CustomTabPanel>
    );
    }
export default SendExcuseLetter;