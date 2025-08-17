const Session=require('../models/Session');
const {v4:uuidv4} =require('uuid');
exports.create=async(req,res)=>{
    try{
        const roomId=uuidv4;
        const newsession= new Session({
            roomId,
            participants:[req.user_id]
        });
        await newsession.save();
        res.status(201).json({
            message:"session created successfully",
            newsession
        })
    }catch(error){
        res.status(500).json({
            message:"server error",
            error:error.message
        });
    }
}

exports.get = async (req, res) => {
    try {
        const session = await Session.findOne({ roomId: req.params.roomId }).populate('participants', 'username role');
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};