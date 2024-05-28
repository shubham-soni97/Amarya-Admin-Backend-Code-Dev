import pool from "../../../config/db.js";

export const fetchEmployeeCountQuery = () => {
    try{
        let sql = `
        SELECT team_id, team , COUNT(*) AS num_employees
        FROM userteams join teams on userteams.team_id = teams._id
        GROUP BY team_id;
  `;
    return pool.query(sql);
    }catch(err){
        console.log("Error in executing the fetchEmployeeCountQuery : " , err);
        throw(err)
    }
}

