const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');

// Controller to handle getting all jobs
const getAllJobs = async (req, res) => {
   const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
   res.status(StatusCodes.OK).json({jobs, count: jobs.length});
}

// Controller to handle getting a single job
const getJob = async (req, res) => {
    const {
        user:{userId}, 
        params:{id:jobId}
    } = req;

    const job = await Job.findOne({
        _id: jobId, 
        createdBy: userId
    });
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`);
    }
    res.status(StatusCodes.OK).json({job});
}
// Controller to handle creating a new job
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;// Add the user ID to the request body
    const job = await Job.create(req.body);// Create a new job with the request body
    res.status(StatusCodes.CREATED).json({job});// Create a new job with the request body
}
// Controller to handle updating a job
const updateJob = async (req, res) => {
    const {
        body:{company, position},
        user:{userId}, 
        params:{id:jobId}
    } = req;
if (company === '' || position === '') {
    throw new BadRequestError('Company or Position fields cannot be empty');
}
const job = await Job.findOneAndUpdate(
    {_id: jobId, createdBy: userId}, req.body,
    {new: true, runValidators: true}
);
if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
}
res.status(StatusCodes.OK).json({job});
}
// Controller to handle deleting a job
const deleteJob = async (req, res) => {
    const {
        user:{userId}, 
        params:{id:jobId}
    } = req;
    const job = await Job.findOneAndRemove({
        _id: jobId, 
        createdBy: userId
    });
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`);
    }
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}