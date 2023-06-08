const express = require('express');
const { getAllJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobs');
const jobRouter = express.Router();

jobRouter.route('/').get(getAllJobs).post(createJob)
jobRouter.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

module.exports = jobRouter;