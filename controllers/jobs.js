const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');

// Controller to handle getting all jobs
const getAllJobs = async (req, res) => {
    res.send('get all jobs');// response
}
// Controller to handle getting a single job
const getJob = async (req, res) => {
    res.send('get job');
}
// Controller to handle creating a new job
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;// Add the user ID to the request body
    const job = await Job.create(req.body);// Create a new job with the request body
    res.status(StatusCodes.CREATED).json({job});// Create a new job with the request body
}
const updateJob = async (req, res) => {
    res.send('update job');
}
const deleteJob = async (req, res) => {
    res.send('delete job');
}
module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}