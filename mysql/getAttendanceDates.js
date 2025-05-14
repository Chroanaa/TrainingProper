import axios from "axios";
export const getAttendanceDates = async () => {
    try {
        const response = await axios.get("http://localhost/backend/database/attendance/getAttendanceLogs.php")
        const data = await response.data;
        return data
    }catch (error) {
        console.error("Error fetching attendance data:", error);
        throw error;
    }
}