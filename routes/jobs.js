const express = require('express');
const router = express.Router();

// Import job controllers
const {
    getAllJobs, 
    getJob, 
    createJob, 
    updateJob, 
    deleteJob
} = require('../controllers/jobs');

// Define route for getting all jobs and creating a new job
router.route('/')
    .get(getAllJobs)
    .post(createJob);

// Define route for getting, updating and deleting a job
router.route('/:id')
    .get(getJob)
    .patch(updateJob)
    .delete(deleteJob);

module.exports = router;