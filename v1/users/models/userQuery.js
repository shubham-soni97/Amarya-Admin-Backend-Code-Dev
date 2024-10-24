import pool from "../../../config/db.js"


export const getUserDataByUsernameQuery = (array)=> {
    try {
        let query = `SELECT * FROM users WHERE username = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserDataByUsernameQuery:", error);
        throw error;
    }
}

export const getAllUserData = ()=> {
    try {
        let query = `SELECT * FROM users`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getAllUserData:", error);
        throw error;
    }
}

export const userRegistrationQuery = (array)=> {
    try {
        let query = `INSERT INTO users (
            emp_id,
            username,
            password,
            first_name,
            last_name,
            email,
            gender,
            profile_picture, 
            blood_group,
            mobile_number,
            emergency_contact_number,
            emergency_contact_person_info,
            address,
            dob, 
            designation,
            designation_type,
            joining_date,
            experience,
            completed_projects,
            performance,
            team_id,
            client_report,
            role
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing userRegistrationQuery:", error);
        throw error;
    }
}

export const userDetailQuery = (array)=>{
    try {
        let query = `SELECT * FROM users WHERE email = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing userDetailQuery:", error);
        throw error;
    }
}

export const checkUserNameAvailabilityQuery = (array)=>{
    try {
        let query = `SELECT * FROM users WHERE username = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing userDetailQuery:", error);
        throw error;
    }
}

export const updateTokenQuery = (array) => {
    try {
        let query = `UPDATE users SET jwt_token = ? WHERE emp_id = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateTokenQuery:", error);
        throw error;
    }
}

export const updateExperienceQuery = (array) => {
    try {
        let query = `UPDATE users SET experience = ? WHERE emp_id = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateExperienceQuery:", error);
        throw error;
    }
}

export const getLastEmployeeIdQuery = () =>{
    try {
        let query = `SELECT * FROM users ORDER BY emp_id DESC LIMIT 1`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getLastEmployeeIdQuery:", error);
        throw error;
    }
}

export const updateUserPasswordQuery = (array) =>{
    try {
        let query = `UPDATE users SET password = ?, otp = ? WHERE email = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUserPasswordQuery:", error);
        throw error;
    }
}

export const getAllLeaveCounts = () =>{
    try {
        let query = `SELECT _id, leave_type, leave_count FROM leaveTypeCounts`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getAllLeaveCounts:", error);
        throw error;
    }
}

export const insertUserLeaveCountQuery = (array)=>{
    try {
        let query = `INSERT INTO userLeaveCounts (emp_id, leave_type, leave_count, leave_type_id) VALUES(?,?,?,?)`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserLeaveCountQuery:", error);
        throw error;
    }
}

export const insertOtpQuery = (array) => {
    try {
        let query = `UPDATE users SET otp = ? WHERE email = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserLeaveCountQuery:", error);
        throw error;
    }
}

export const getOtpQuery = (array) => {
    try {
        let query = `SELECT otp FROM users WHERE email = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserLeaveCountQuery:", error);
        throw error;
    }
}

export const checkUserDataByUserIdQuery = (array)=> {
    try{
    let query = `SELECT * FROM users WHERE emp_id = ?`
    return pool.query(query, array);
    }
    catch (error) {
        console.error("Error executing checkUserDataByUserIdQuery:", error);
        throw error;
}
}

export const updateUserProfileQuery = async (query,array) => {
    try {
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUserProfileQuery:", error);
        throw error;
    }
}

export const getUserDataByUserIdQuery = (array) =>{
    try {
        let query = `SELECT
                    u._id,
                    u.emp_id,
                    u.username,
                    u.first_name,
                    u.last_name,
                    u.email,
                    u.gender,
                    u.profile_picture,
                    u.blood_group,
                    u.mobile_number,
                    u.emergency_contact_number,
                    u.emergency_contact_person_info,
                    u.address,
                    u.dob,
                    u.designation,
                    u.designation_type,
                    u.joining_date,
                    ROUND(u.experience, 2) AS experience,
                    u.completed_projects,
                    u.performance,
                    u.team_id,
                    u.client_report,
                    i.public_id,
                    (SELECT COUNT(DISTINCT w.team_id)
                        FROM worksheets w
                        WHERE w.emp_id = u.emp_id) AS teams
                FROM
                    users u
                LEFT JOIN
                    images i ON i.emp_id = u.emp_id
                WHERE
                    u.emp_id = ?;`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserDataByUserIdQuery:", error);
        throw error;
    }
}

export const updateUserProfilePictureQuery = async (array) => {
    try {
        let query = `UPDATE users SET profile_picture = ? WHERE emp_id = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUserProfilePictureQuery:", error);
        throw error;
    }
}

export const fetchAllEmployeeIdsQuery = async () => {
    try {
        let query = `SELECT emp_id, CONCAT(first_name, ' ', last_name) AS name FROM users WHERE role = 'user'`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchAllEmployeeIdsQuery:", error);
        throw error;
    }
}
export const fetchAllEmployeeListQuery = async () => {
    try {
        let query = `
        SELECT 
            users.emp_id, 
            CONCAT(users.first_name, ' ', users.last_name) AS full_name, 
            users.username,
            users.experience, 
            users.designation, 
            users.joining_date,
            CASE 
                WHEN MAX(CASE 
                        WHEN categories.category = 'Client Project' 
                             AND CURDATE() BETWEEN STR_TO_DATE(CONCAT('01/', userProjects.start_month), '%d/%m/%y') 
                             AND LAST_DAY(STR_TO_DATE(CONCAT('01/', userProjects.end_month), '%d/%m/%y'))
                        THEN 1 ELSE 0 
                    END) = 1
                THEN 'allocated'
                ELSE 'not yet allocated'
            END AS project_status
        FROM users
        LEFT JOIN userProjects ON users.emp_id = userProjects.emp_id
        LEFT JOIN projects ON userProjects.project_id = projects._id
        LEFT JOIN categories ON projects.category_id = categories._id
        WHERE users.role = 'user'
        GROUP BY users.emp_id, users.first_name, users.last_name, users.username, users.experience, users.designation, users.joining_date`;
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchAllEmployeeListQuery:", error);
        throw error;
    }
}
