const JobModel = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async(req,res) => {
    const {userId} = req.user;

    const jobs = await JobModel.find({createdBy : userId}).sort('createdAt').select('company position status');

    res.status(StatusCodes.OK).json({jobs, count:jobs.length, success:true})
}

const getJob = async(req,res) => {
    const {
        params : {id : jobId},
        user : {userId}
    } = req
    const job = await JobModel.findOne({_id : jobId, createdBy:userId});

    if(!job) {
        throw new NotFoundError(`No Job with id : ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job, success:true});
}

const createJob = async(req,res) => {
    req.body.createdBy = req.user.userId;
    const {company, position} = req.body;

    if(!company || !position) {
        new BadRequestError("Please provide Company Name and Position");
    }
    const job = await JobModel.create({...req.body});
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async(req,res) => {
    const {
        body : newJob,
        params : {id:jobId},
        user : {userId}
    } = req;
    const job = await JobModel.findOneAndUpdate({_id : jobId, createdBy:userId}, newJob, {
        new:true,
        runValidators:true
    });

    if(!job) {
        throw NotFoundError(`No Job found with id : ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job, success:true});
}

const deleteJob = async(req,res) => {
    const {
        params : {id:jobId},
        user : {userId}
    } = req

    const job = await JobModel.findOneAndDelete({_id : jobId, createdBy : userId});

    if(!job) {
        throw new NotFoundError(`No Job found with id : ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job, msg:"Job Deleted Successfully", success:true});
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
};