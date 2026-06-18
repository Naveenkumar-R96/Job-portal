import User from '../models/user.model.js'

//toggle save job

export const toggleSaveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }

        const isSaved = user.savedJobs.includes(jobId);

        if (isSaved) {
            user.savedJobs = user.savedJobs.filter(
                id => id.toString() !== jobId
            );
        }
        else {
            user.savedJobs.push(jobId);
        }

        await user.save();
        res.status(200).json({
            status: true,
            message: isSaved ? "job unsaved" : " job saved",
            savedJobs: user.savedJobs
        })
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}


//toggle save questions

export const toggleSavedQuestions = async (req, res) => {
    try {
        const { questionId } = req.params;
        const userId = req.user.id;
        const { type } = req.query;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }

        let isSaved;
        let message;

        if (type === "role") {
            isSaved = user.savedRoleQuestions.includes(questionId);

            if (isSaved) {
                user.savedRoleQuestions = user.savedRoleQuestions.filter(
                    id => id.toString() !== questionId
                );
                message = "question unsaved";
            }
            else {
                user.savedRoleQuestions.push(questionId);
                message = "question saved";
            }
        }
        else {
            isSaved = user.savedInterviewQuestions.includes(questionId);
            if (isSaved) {
                user.savedInterviewQuestions = user.savedInterviewQuestions.filter(id => id.toString() !== questionId);
                message = "question unsaved";
            }
            else {
                user.savedInterviewQuestions.push(questionId);
                message = "question saved";
            }
        }

        await user.save();
        res.status(200).json({
            status: true,
            message,
            savedInterviewQuestions: user.savedInterviewQuestions,
            savedRoleQuestions: user.savedRoleQuestions
        })
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}


//to get all saved items

export const getSavedItems = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(req.user);


        const user = await User.findById(userId).populate('savedJobs').populate({ path: "savedInterviewQuestions", populate: { path: "company" } }).populate({ path: "savedRoleQuestions", populate: { path: "roleId" } });

        if(!user){
            return res.status(404).json({
                status:false,
                message: "User not found"
            })
        }
        console.log(user);


        res.status(200).json({
            status: true,
            savedJobs: user.savedJobs,
            savedInterviewQuestions: user.savedInterviewQuestions,
            savedRoleQuestions: user.savedRoleQuestions
        })
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}