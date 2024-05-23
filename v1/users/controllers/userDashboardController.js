import { validationResult } from "express-validator";
import { fetchActivityORAnnouncementQuery, updateUserCompletedProjectCountQuery, userDashboardProfileQuery, fetchUserProjectQuery, fetchUserCurrentProjectQuery } from "../models/userDashboardQuery.js";
import { successResponse, errorResponse, notFoundResponse } from "../../../utils/response.js";
import { feedbackFormQuery, fetchFeebackQuery} from '../models/userFeedbackQuery.js';
import { getUserDataByUserIdQuery } from '../models/userQuery.js';
import { fetchImagesForDashboardQuery } from '../../images/imagesQuery.js';
import dotenv from "dotenv";
dotenv.config();

export const userDashboard = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }

    let dashboard_data = [];
    const emp_id = req.params.emp_id;

    let [emp_data] = await userDashboardProfileQuery([emp_id])

    if(emp_data.length == 0) {
      return notFoundResponse(res, '', 'Data not found.');
    }
    let [announcement_data] = await fetchActivityORAnnouncementQuery(["announcement"]);
    let [activity_data] = await fetchActivityORAnnouncementQuery(["activity"]);
    await updateUserCompletedProjectCountQuery([emp_id])

    let [current_project] = await fetchUserCurrentProjectQuery([emp_id])
    const [project_data] = await fetchUserProjectQuery([emp_id])
    let data = {
      emp_data: emp_data.length > 0 ? emp_data[0] : null,
      announcement: announcement_data.length > 0 ? announcement_data : null,
      activity: activity_data.length > 0 ? activity_data : null,
      current_project: current_project.length > 0 ? current_project[0] : null,
      projects_this_year: project_data.length > 0 ? project_data : null
    }

    dashboard_data.push(data)
    return successResponse(res, dashboard_data, "Dashboard Data Fetched Successfully");
  } catch (error) {
    next(error);
  }
};

export const feedbackForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "")
    }
    const { emp_id, date, subject, description } = req.body;

    const [user] = await getUserDataByUserIdQuery([emp_id]);
    if (user.length == 0 ){
        return notFoundResponse(res, '', 'User not found');
    }

    await feedbackFormQuery([
      emp_id,
      date,
      subject,
      description
    ]);

    return successResponse(res, '', 'Feedback send successfully.');
  } catch (error) {
    next(error);
  }
};

export const fetchFeedbackData = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "")
    }

    const [data] = await fetchFeebackQuery();
    
    if(data.length == 0) {
      return notFoundResponse(res, '', 'Data not found.');
    }

    return successResponse(res, data, 'Feedback send successfully.');
  } catch (error) {
    next(error);
  }
};

export const getDashboardImages = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "")
    }

    const [data] = await fetchImagesForDashboardQuery();
    
    if(data.length == 0) {
      return notFoundResponse(res, '', 'Data not found.');
    }

    return successResponse(res, data, 'Images fetched successfully.');
  } catch (error) {
    next(error);
  }
};