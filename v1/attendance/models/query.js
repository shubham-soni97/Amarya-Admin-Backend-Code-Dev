import pool from "../../../config/db.js"

export const insertUserAttendanceLogsQuery = async (array) => {
    try {
        let query = `
        INSERT INTO userAttendanceLogs (status, date, snapshot, user_id) 
        VALUES (?, ?, ?, ?)
        `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserAttendanceQuery:", error);
        throw error;
    }
}

export const insertUserAttendanceQuery = async (array) => {
    try {
        let query = `
        INSERT INTO userAttendance (status, date, in_time, out_time, in_snapshot, user_id, out_snapshot) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserAttendanceQuery:", error);
        throw error;
    }
}


export const getUserAttendanceByUserIdAndDateQuery = (array) => {
    try {
        let query = `SELECT * FROM userAttendance WHERE date = ? AND user_id = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserAttendanceByUserIdAndDateQuery:", error);
        throw error;
    }
}

export const getUserByUserNameQuery = (array) => {
    try {
        let query = `select * From users where username = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserByUserNameQuery", error);
    }
}

export const updateOutTime = async (array) => {
    try {
        let query = `
            UPDATE userAttendance
            SET out_time=NOW(), out_snapshot= ? where id=?
            `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateOutTime:", error);
        throw error;
    }
}

export const checkUserAttendanceLogsQuery = (array) => {
    try {
        let query = `SELECT * FROM userAttendanceLogs WHERE date = ? AND user_id = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing checkUserAttendanceLogsQuery:", error);
        throw error;
    }
}


export const checkUserTimeFromLogs = (array) => {
    try {
        let query = `SELECT ua.user_id, 
                    ua.date AS date, 
                    MIN(ua.created_at) AS in_time, 
                    MAX(ua.created_at) AS out_time,
                    (SELECT snapshot FROM userAttendanceLogs WHERE user_id = ua.user_id AND created_at = MIN(ua.created_at)) AS in_snapshot,
                    (SELECT snapshot FROM userAttendanceLogs WHERE user_id = ua.user_id AND created_at = MAX(ua.created_at)) AS out_snapshot
                    FROM 
                    userAttendanceLogs ua WHERE DATE(created_at) = ?
                    GROUP BY ua.user_id, DATE(ua.created_at), ua.date`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing checkUserTimeFromLogs:", error);
        throw error;
    }
}

export const deleteAttendanceLogsQuery = (array) => {
    try {
        let query = `DELETE FROM userAttendanceLogs WHERE date < ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing deleteAttendanceLogsQuery:", error);
        throw error;
    }
}

export const insertUnknownUserAttendanceQuery = async (array) => {
    try {
        let query = `
        INSERT INTO unknownUserAttendance
        (status, date, snapshot)
        VALUES(?, ?, ?)
        `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUnknownUserAttendanceQuery:", error);
        throw error;
    }
}


export const deletingAttendanceLogEveryHourQuery = async (array) => {
    try {
        let query = `
            WITH RankedLogs AS (
             SELECT id, 
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) AS row_asc,
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS row_desc
            FROM userAttendanceLogs WHERE date = CURRENT_DATE())
            DELETE FROM userAttendanceLogs
            WHERE id IN (
                SELECT id FROM RankedLogs
                WHERE row_asc > 5 AND row_desc > 5
            )
        `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing deletingAttendanceLogEveryHourQuery:", error);
        throw error;
    }
}

export const getUserAttendanceSummaryQuery = async (array) => {
    try {
        const [startDate, endDate, empId] = array;
        let query = `CALL attendanceSummaryProc('${startDate}', '${endDate}', '${empId}')`;
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getUserAttendanceSummaryQuery:", error);
        throw error;
    }
}
export const getWeeklyPresentCountQuery = async () => {
    try {
        let query = `
        SELECT 
            DATE_FORMAT(date, '%Y-%m-%d') AS attendance_date,
            DAYNAME(date) AS day_name,
            COUNT(*) AS present_count
        FROM 
            userAttendance
        WHERE 
            YEARWEEK(date, 1) BETWEEN YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) 
                                AND YEARWEEK(CURDATE(), 1)
            AND status = 'PRESENT'
            AND DAYOFWEEK(date) BETWEEN 2 AND 6
        GROUP BY 
            attendance_date, day_name
        ORDER BY 
            attendance_date;
        `;
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getWeeklyPresentCountQuery:", error);
        throw error;
    }
}

export const fetchUserPresentAttendanceQuery = async (skip) => {
    try {
        let query = `
        SELECT
            UA.id AS id,
            U.emp_id AS emp_id,
            U.username AS username,
            UA.status AS status,
            UA.in_time AS in_time,
            UA.out_time AS out_time,
            UA.in_snapshot AS in_snapshot,
            UA.out_snapshot AS out_snapshot
        FROM
            userAttendance as UA
        JOIN users AS U ON UA.user_id = U._id
        WHERE
            date = DATE_FORMAT(CURDATE() - INTERVAL 1 DAY, '%Y-%m-%d')
        ORDER BY date DESC
        LIMIT 10 OFFSET ${skip}
        `;
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchUserPresentAttendanceQuery:", error);
        throw error;
    }
}
export const fetchUnidentifiedPeopleListQuery = async (skip) => {
    try {
        let query = `
        SELECT 
            * 
        FROM unknownUserAttendance
        ORDER BY date DESC
        LIMIT 10 OFFSET ${skip}
        `;
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchUnidentifiedPeopleListQuery:", error);
        throw error;
    }
}


export const getUnknownUserAttendanceQuery = async (array) => {
    try {
        let query = `
        select * from unknownUserAttendance uua where uua.id = ? and uua.date = ? `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUnknownUserAttendanceQuery:", error);
        throw error;
    }
}

export const updateInTimeUserAttenQuery = async (array) => {
    try {
        let query = `
        UPDATE userAttendance SET in_time = ?, in_snapshot = ? WHERE user_id = ? and date = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateInTimeUserAttenQuery:", error);
        throw error;
    }
}

export const updateUserAttendanceQuery = async (array) => {
    try {
        let query = `
        INSERT INTO userAttendance (status, date, in_time, in_snapshot, user_id) 
        VALUES (?, ?, ?, ?, ?)
        `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUserAttendanceQuery:", error);
        throw error;
    }
}

export const getUserByEmpIdQuery = (array) => {
    try {
        let query = `select * From users where emp_id = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserByEmpIdQuery", error);
    }
}

export const getUserAttendanceLogByUserIdAndDateForInTimeQuery = (array) => {
    try {
        let query = `select * From userAttendanceLogs ual where user_id = ? and date = ? order by id asc limit 2`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserAttendanceLogByUserIdAndDateForInTimeQuery", error);
    }
}

export const updateUnknownAttendance = (array) => {
    try {
        let query = `UPDATE amaryadashboard.unknownUserAttendance SET  emp_id = ? WHERE id = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUnknownAttendance", error);
    }
}

export const updateOutTimeUserAttenQuery = async (array) => {
    try {
        let query = `
        UPDATE userAttendance SET out_time = ?, out_snapshot = ?  WHERE user_id = ? and date = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateOutTimeUserAttenQuery:", error);
        throw error;
    }
}

export const getUserAttendanceLogByUserIdAndDateForOutTimeQuery = (array) => {
    try {
        let query = `select * From userAttendanceLogs ual where user_id = ? and date = ? order by id desc limit 2`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserAttendanceLogByUserIdAndDateForOutTimeQuery", error);
    }
}


export const fetchAttedancePercentageOfUsersByDateQuery = (array) => {
    try {
        let query = `SELECT 
        COUNT(u._id) AS total_users,
        COUNT(ua.user_id) AS present_users,
        COUNT(u._id) - COUNT(ua.user_id) AS absent_users,
        FORMAT((COUNT(ua.user_id) / COUNT(u._id)) * 100, 2) AS present_percentage,
        FORMAT(((COUNT(u._id) - COUNT(ua.user_id)) / COUNT(u._id)) * 100, 2) AS absent_percentage
        FROM users u LEFT JOIN 
        userAttendance ua ON u._id = ua.user_id AND ua.date IN (?)`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserAttendanceLogByUserIdAndDateForOutTimeQuery", error);
    }
}