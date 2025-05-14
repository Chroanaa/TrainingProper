import React from "react";
import CustomTabPanel from "../ui/CustomTabPanel";
import { Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

function SendExcuseLetter({ value, index }) {
    const [state, setState] = React.useState({});
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    }
    React.useEffect(() => {
        console.log("State changed:", state);
    },[state]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = new FormData();
        form.append("subject", state.subject);
        form.append("message", state.Message);
        setState({ subject: "", Message: "" });
        try {
            const response = await axios.post("http://localhost/backend/sendExcuseLetter.php", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Email sent successfully!",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to send email.",
                });
            }
        } catch (error) {
            console.error("Error sending request:", error);
        }
    };
    return (
        <CustomTabPanel value={value} index={index}>
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1>Send Excuse Letter For late submission of reports</h1>
            <label htmlFor="Subject">Subject:</label>
            <input type="text" name = "subject" onChange={handleChange} />
            <label htmlFor="Message">Message:</label>
            <textarea name="Message" onChange={handleChange} id="Message" cols="30" rows="10"></textarea>
            <Button variant="contained" onClick={handleSubmit}>Send</Button>

        </div>
        </CustomTabPanel>
    );
    }
export default SendExcuseLetter;