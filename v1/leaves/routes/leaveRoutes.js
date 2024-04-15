import express, { Router } from 'express';
const app = express()
const router = Router();
import { addHoliday, updateHoliday,addLeaveType, addLeaveTypeAndCount, fetchLeaveTypesAndTheirCount, leaveRequest, fetchListOfLeaves, getAllUsersLeaveCountByAdmin, getUserLeaveData, fetchLeaveTakenOverview, updateLeaveTypeAndCount, deleteLeaveTypeAndCount, fetchHolidayList, deleteHoliday,updateLeaveType,deleteLeaveType} from '../controllers/leaveController.js';
import {addHolidayVal, updateHolidayVal, addLeaveTypeVal, addLeaveCountVal, updateLeaveVal, leaveRequestVal, updateLeaveTypeAndCountVal, deleteLeaveTypeAndCountVal, getAllLeaveCountVal} from '../../../utils/validation.js';


app.post('/admin/add-holiday',addHolidayVal, addHoliday);
app.put('/admin/update-holiday/:id',updateHolidayVal, updateHoliday);
app.post('/admin/add-leave-type',addLeaveTypeVal, addLeaveType);
app.post('/admin/add-leave-type-and-count',addLeaveCountVal, addLeaveTypeAndCount);
app.put('/admin/update-leave-type-and-count/:id/:leaveTypeId',updateLeaveTypeAndCountVal, updateLeaveTypeAndCount);
app.delete('/admin/delete-leave-type-and-count/:id/:leaveTypeId',deleteLeaveTypeAndCountVal, deleteLeaveTypeAndCount);
app.put('/admin/update-leave-type/:id',updateLeaveVal, updateLeaveType);
app.delete('/admin/delete-leave-type/:id', deleteLeaveType);
app.get('/fetch-leave-type-and-count', fetchLeaveTypesAndTheirCount);
app.get('/fetch-leaves-list', fetchListOfLeaves);
app.post('/leave-request',leaveRequestVal, leaveRequest);
app.get('/get-all-leave-count/:id',getAllLeaveCountVal, getAllUsersLeaveCountByAdmin);
app.get('/user-leave-data', getUserLeaveData);
app.get('/get-leave-overview', fetchLeaveTakenOverview);
app.get('/fetch-holiday-list', fetchHolidayList);
app.delete('/admin/delete-holiday/:id', deleteHoliday);

app.use("/", router);

export default app;