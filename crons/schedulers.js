// Schedule script execution every minute
import cron from "node-cron";
import pool from "../config/db.js";
import { generateUserWorksheetExcel, updateEntries, calculatePerformanceForEachEmployee, updateYearlyDataForEachEmployee, updateMonthlyExperienceCron, saveAttendance, deleteAttendanceLogs, sendEmailNotificationForApproval } from "./cronFunctions.js";
import {deletingAttendanceLogEveryHourQuery } from "../v1/attendance/models/query.js";


export const runCronJobs = () => {

    // cron.schedule('* * * * *', async () => {
    //     try {
    //         await updateEntries();
    //     } catch (error) {
    //         console.error('Error executing cron updateEntries:', error);
    //     }
    // });

    cron.schedule('30 23 1 * *', async () => {
        try {
            await generateUserWorksheetExcel()
        } catch (error) {
            console.error('Error executing cron generateUserWorksheetExcel:', error);
        }
    });

    cron.schedule('30 17 * * *', async () => {
        try {
            const query_count = `SELECT COUNT(*) as count FROM worksheets`;
            const [rows] = await pool.query(query_count);
            const count = rows[0].count;
    
            if (count > 0) {
                const current_date = new Date();
                const deletion_date = new Date(current_date.setDate(current_date.getDate() - 35));
    
                const delete_query = `DELETE FROM worksheets WHERE date < ?`;
                await pool.query(delete_query, [deletion_date]);
                console.log('Deletion completed successfully.');
            } else {
                console.log('No entries found in worksheet. Skipping deletion.');
            }
        } catch (error) {
            console.error('Error executing cron deletion scheduler:', error);
        }
    });
    
    cron.schedule('40 22 1 * *', async () => {
        try {
            await calculatePerformanceForEachEmployee()
        } catch (error) {
            console.error('Error executing cron calculatePerformanceForEachEmployee:', error);
        }
    });

    cron.schedule('45 23 1 1 *', async () => {
        try {
            await updateYearlyDataForEachEmployee()
        } catch (error) {
            console.error('Error executing cron updateYearlyDataForEachEmployee:', error);
        }
    });

    cron.schedule('0 0 1 * *', async () => {
        try {
            await updateMonthlyExperienceCron()
        } catch (error) {
            console.error('Error executing cron updateMonthlyExperienceCron:', error);
        }
    });

    cron.schedule('0 * * * *', async () => {
        try{
            await sendEmailNotificationForApproval()
        } catch (error){
            console.error('Error executing cron sendEmailNotificationForApproval:', error);
        }
    });

    cron.schedule('0 0 * * *', async () => {
        try {

            console.log("scheduler called: saving attendance and deleting logs before 2 days")
            await saveAttendance();
            await deleteAttendanceLogs(); //deleting all logs before 2 days
        } catch (error) {
            console.error('Error executing cron saveAttendance:', error);
        }
    });


    

    cron.schedule('*/30 * * * *', async () => {
        // cron.schedule('* * * * *', async () => {
        try {
            console.log("Scheduler called: deleting attendance logs excluding 1st and last 5 entries per user");
            await deletingAttendanceLogEveryHourQuery();
        } catch (error) {
            console.error('Error executing cron deletingAttendanceLogEveryHour:', error);
        }
    });


    
}