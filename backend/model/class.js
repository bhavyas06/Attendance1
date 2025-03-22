const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    attendance: {
        type: Schema.Types.ObjectId,
        ref: 'Attendance'
    },
    resources: [{
        type: Schema.Types.ObjectId,
        ref: 'Resource'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
classSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;

