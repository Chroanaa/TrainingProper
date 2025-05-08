import axios from "axios"
export const getAttendance = async ()=> {
    try {
        const response = await axios.get("http://localhost/backend/database/attendance/getAttendance.php")
        const data = await response.data
        return data
    } catch (error) {
        console.error("Error fetching attendance data:", error)
        throw error
    }
}