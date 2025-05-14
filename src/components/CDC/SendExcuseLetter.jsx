import React from "react";
import CustomTabPanel from "../ui/CustomTabPanel";
import { Button, TextField, Paper, Typography, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import MailOutlineIcon from '@mui/icons-material/MailOutline';

function SendExcuseLetter({ value, index }) {
    const [state, setState] = React.useState({
        subject: "",
        Message: ""
    });
    const [loading, setLoading] = React.useState(false);

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    React.useEffect(() => {
        console.log("State changed:", state);
    }, [state]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validate inputs
        if (!state.subject || !state.Message) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete Form",
                text: "Please fill in both subject and message fields.",
            });
            return;
        }
        
        setLoading(true);
        const form = new FormData();
        form.append("subject", state.subject);
        form.append("message", state.Message);
        
        try {
            const response = await axios.post("http://localhost/backend/sendExcuseLetter.php", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            
            if (response.status === 200) {
                setState({ subject: "", Message: "" });
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
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to send email. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomTabPanel value={value} index={index}>
            <Box className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
                <Paper elevation={3} className="p-8 w-full max-w-md">
                    <Box className="flex items-center justify-center mb-6">
                        <MailOutlineIcon fontSize="large" color="primary" />
                        <Typography variant="h5" component="h1" className="ml-2 font-semibold text-center">
                            Send Excuse Letter
                        </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" className="mb-6 text-center">
                        Use this form to submit an excuse letter for late submission of reports
                    </Typography>
                    
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Subject"
                            name="subject"
                            value={state.subject}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            placeholder="Enter subject line"
                            required
                        />
                        
                        <TextField
                            label="Message"
                            name="Message"
                            value={state.Message}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={6}
                            placeholder="Type your excuse letter content here..."
                            required
                        />
                        
                        <Box className="mt-6">
                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                onClick={handleSubmit}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : null}
                            >
                                {loading ? "Sending..." : "Send Letter"}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </CustomTabPanel>
    );
}

export default SendExcuseLetter;