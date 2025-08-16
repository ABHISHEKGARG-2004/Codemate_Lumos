const mongoose = require('mongoose');

const CodeSnapshotSchema = new mongoose.Schema({
    code: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const SessionSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    currentCode: {
        type: String,
        default: '// Welcome to CodeMate! Start coding here.',
    },
    language: {
        type: String,
        default: 'javascript', // Default language
    },
    codeHistory: [CodeSnapshotSchema],
    isHandRaised: {
        type: Boolean,
        default: false,
    },
    raisedBy: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
