import userModel from "../models/userModel.js";
import groupModel from "../models/groupModel.js";
import clubModel from "../models/clubModel.js";

export const getAllUsers = async (req, res) => {
    try {
       const users = await userModel.find().sort({ createdAt: -1 }).select('-password');
       res.status(200).json({ users: users })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.user.id }).select('-password');
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const searchUser = async (req, res) => {
    const { searchKey } = req.query;
    try {
        const key = new RegExp(searchKey, 'i')
        const users = await userModel.find({ $or: [{name: key}, {department: key}, {batch: key}, {email: key}] }).select('-password').sort({isTeacher: -1});
        const clubs = await clubModel.find({ $or: [{name: key}, {category: key}] }).sort({ createdAt: -1 });
        const groups = await groupModel.find({ $and: [{name: key},  {visibility: 'visible'}] }).sort({ createdAt: -1 });
        const searchResult = [...users, ...clubs, ...groups]
        res.status(200).json({ searchResult })
    } catch (error) {
        res.status(500).json({ message: 'Something went error' })
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.user;
    const { school, degree, field_of_study, job_title, position, company_name, time, types, isShow  } = req.body
    try {
        if (school && degree && field_of_study) {
            const findUser = await userModel.findById(id);
            const existsData = findUser.education_background.some(data => data.degree === degree );
            if (existsData === true) {
                await findUser.updateOne({$pull: { education_background: {degree}}});
                await findUser.updateOne({$push: {education_background: [req.body]}});
                const user = await userModel.findById(id);
                res.status(200).json({ user: user })
            } else {
                await findUser.updateOne({$push: { education_background: [req.body] }});
                const user = await userModel.findById(id)
                res.status(200).json({ user: user })
            }
        } else if (job_title && position && company_name) {
           const findUser = await userModel.findById(id);
           const existsData = findUser.jobs.some(data => data.company_name === company_name );
            if (existsData === true) {
                await findUser.updateOne({$pull: { jobs: {company_name}}});
                await findUser.updateOne({$push: {jobs: [req.body]}});
                const user = await userModel.findById(id);
                res.status(200).json({ user: user })
            } else {
                await findUser.updateOne({$push: { jobs: [req.body] }});
                const user = await userModel.findById(id)
                res.status(200).json({ user: user })
            }

        }
        else if (time && types) {
            await userModel.updateOne({ _id: req.user.id }, {$pull: { notifications: { time, types }}});
            const user = await userModel.findById(req.user.id);
            res.status(200).json({ user })
        }
        else if (isShow) {
            await userModel.updateOne({"_id": req.user.id, "notifications.isShow": false } , { $set: { "notifications.$.isShow": true } });
            const findUser = await userModel.findById(req.user.id);
            res.status(200).json({ user: findUser })
        }
        else {
            const updateDate = await userModel.findByIdAndUpdate(id, req.body, {new: true});
            res.status(200).json({user: updateDate})
        }
    } catch (error) {
       res.status(500).json({ message: 'Something went wrong' });
    }
}

export const deleteEducationBackGround = async (req, res) => {
    const { degree } = req.params
    try {
        const findUser = await userModel.findOne({ _id: req.user.id });
        await findUser.updateOne({ $pull: { education_background : { degree } } });
        const user = await userModel.findOne({ _id: req.user.id });
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const deleteJob = async (req, res) => {
    const { company_name } = req.params
    try {
        const findUser = await userModel.findOne({ _id: req.user.id });
        await findUser.updateOne({ $pull: { jobs : { company_name } } });
        const user = await userModel.findOne({ _id: req.user.id });
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const connect = async (req, res) => {
    const { userId } = req.params;
    const currentUserId  = req.user.id;

    if (userId !== currentUserId) {
        try {
           const user = await userModel.findById(userId);
           const currentUser = await userModel.findById(currentUserId);

           if (!user.connection_requests.includes(currentUserId)) {
               await user.updateOne({ $push: { connection_requests:  currentUserId, notifications: [{ notify_by: currentUserId, types: 'connection_request', time: Date.now(), isShow: false }] } });
               await currentUser.updateOne({ $push: { connecting : userId } });
               const finalResult = await userModel.findById(currentUserId);
               res.status(200).json({ user: finalResult });
           } else {
               res.status(403).json({ message: 'You are already requested for connect' })
           }

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    } else {
        res.status(403).json({ message: 'You can not connect your self' })
    }
}

export const disconnect = async (req, res) => {
    const { userId } = req.params;
    const  currentUserId  = req.user.id;

    if (userId !== currentUserId) {
        try {
            const user = await userModel.findById(userId);
            const currentUser = await userModel.findById(currentUserId);

            if (user.connecting.includes(currentUserId) || user.connection_requests.includes(currentUserId)) {
                await user.updateOne({ $pull: { connecting: currentUserId, connection_requests: currentUserId, notifications: { notify_by: currentUserId, types: 'connection_request' }} });
                await currentUser.updateOne({ $pull: { connecting: userId, connection_requests: userId, notifications: { notify_by: userId, types: 'connection_request' } } });
                const finalResult = await userModel.findById(currentUserId);
                res.status(200).json({ user: finalResult })
            }
        } catch (error) {
           res.status(500).json({ message: 'something went wrong' });
        }
    } else {
        res.status(403).json({message: 'You can not disconnect your self'})
    }
}

export const accept_connection_request = async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    try {
        const user = await userModel.findOne({ _id: userId });
        const currentUser = await userModel.findOne({ _id: currentUserId });
        if (currentUser.connection_requests.includes(userId)) {
            await user.updateOne({ $pull: { connecting: currentUserId} });
            await currentUser.updateOne({ $pull: { connection_requests: userId, notifications: { notify_by: userId, types: 'connection_request'}} });
            await user.updateOne({ $push: { connection: currentUserId, notifications: [{ notify_by: currentUserId, types: 'connection_accepted', time: Date.now(), isShow: false }] } });
            await currentUser.updateOne({ $push: { connection: userId} });
            const finalResult = await userModel.findOne({ _id: currentUserId });
            res.status(200).json({ user: finalResult })
        }
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}


export const suggestionPeople = async (req,  res) => {
    const { department } = req.params
    try {
        const suggestions = await userModel.find({ department });
        res.status(200).json({ suggestions })
    } catch (error) {
        res.status(500).json({ message: 'Something went to error' })
        console.log(error)
    }
}


