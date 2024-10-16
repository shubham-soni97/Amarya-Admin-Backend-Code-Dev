export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data });
};

export const notFoundResponse = (res, data, message = 'Not Found', statusCode = 404) => {
    return res.status(statusCode).json({ success: false, message, data });
};
export const unAuthorizedResponse = (res, data, message = 'Not Found', statusCode = 401) => {
    return res.status(statusCode).json({ success: false, message, data });
};
export const errorResponse = (res, errors, message = 'Not Found', statusCode = 400) => {
    return res.status(statusCode).json({ success: false, message, errors });
};
export const internalServerErrorResponse = (res, errors, message = 'Something went wrong, Please try again', statusCode = 500) => {
    errors = String(errors)
    return res.status(statusCode).send({ success: false, message, errors });
};

export const cameraUpResponse = (res, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({ camera_status: true, message});
};

export const cameraDownResponse = (res, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({ camera_status: false, message});
};


export const internalServerErrorResponseForCamera = (res, errors, message = 'Something went wrong, Please try again', statusCode = 500) => {
    errors = String(errors)
    return res.status(statusCode).send({ camera_status: false, message, errors });
};