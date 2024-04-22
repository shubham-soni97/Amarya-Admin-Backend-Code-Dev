import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse } from "../../../utils/response.js"
import { addAnnouncementQuery, fetchAnnouncementsQuery, deleteAnnouncementQuery, updateAnnouncementQuery} from "../models/announcementQuery.js";
dotenv.config();


export const createAnnouncement = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {event_type,
            priority,
            from_date, 
            to_date, 
            title, 
            description} = req.body;

        const current_Date = new Date();
        const checkFrom_Date = new Date(from_date);
        const checkTo_Date = new Date(to_date);
        if(checkFrom_Date.toISOString().split('T')[0] < current_Date.toISOString().split('T')[0] ){
            return errorResponse(res, errors.array(), "From date should be greater than or equal to current date");
        }
        if(checkTo_Date < checkFrom_Date){
            return errorResponse(res, errors.array(), "To date should be greater than or equal to the from date");
        }
        if(description.length >200){
            return errorResponse(res, errors.array(), "Description must be written in less than 200 characters");
        }
        if(event_type != "announcement"){
            return notFoundResponse(res, '', 'Event type not supported');
        }

        let [data] = await addAnnouncementQuery([
            event_type,
            priority,
            from_date, 
            to_date, 
            title, 
            description
        ])
        return successResponse(res, data, 'Announcement added successfully');
    } catch (error) {
        next(error);
    }
}

export const fetchAnnouncements = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
    
        let [data] = await fetchAnnouncementsQuery()
        return successResponse(res, data, 'Announcements Fetched Successfully');
    } catch (error) {
        next(error);
    }
}

export const deleteAnnouncements = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const id = req.params.id;
    
        let [data] = await deleteAnnouncementQuery([id])

        if (data.affectedRows == 0){
            return notFoundResponse(res, '', 'Announcement not found, wrong input.');
        }
        return successResponse(res, '', 'Announcements Deleted Successfully');
    } catch (error) {
        next(error);
    }
}

export const updateAnnouncements = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const req_data = req.body;
        const id = req.params.id;

        let updateQuery = 'UPDATE announcements SET ';
        let updateValues = [];

        const condition = {
            _id: id
        };

        Object.keys(req_data).forEach((key, index, array) => {
        updateQuery += `${key} = ?`;
        updateValues.push(req_data[key]);

        if (index < array.length - 1) {
            updateQuery += ', ';
        }
        });

        updateQuery += ' WHERE ';

        Object.keys(condition).forEach((key, index, array) => {
        updateQuery += `${key} = ?`;
        updateValues.push(condition[key]);

        if (index < array.length - 1) {
            updateQuery += ' AND ';
        }
        });

        let [data] = await updateAnnouncementQuery(updateQuery, updateValues)

        if (data.affectedRows == 0){
            return notFoundResponse(res, '', 'Announcement not found, wrong input.');
        }
        return successResponse(res, data, 'Announcement Updated Successfully');
    } catch (error) {
        next(error);
    }
}