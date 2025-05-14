import axios from "axios"
export const getAttendance = async (date)=> {
    try {
        const form = new FormData()
        form.append("date", date)
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
        const response = await axios.post("http://localhost/backend/database/attendance/getAttendance.php",form, config)
        const data = await response.data
        console.log("Attendance data:", data)
        return data
    } catch (error) {
        console.error("Error fetching attendance data:", error)
        throw error
    }
}