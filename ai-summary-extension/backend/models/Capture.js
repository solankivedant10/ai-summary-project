const mongoose = require('mongoose');

const captureSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        default: 'Untitled',
        trim: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 50000 // Limit content length
    },
    wordCount: {
        type: Number,
        default: 0,
        min: 0
    },
    contentLength: {
        type: Number,
        default: 0,
        min: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    summary: {
        type: Object,
        default: null
    },
    summaryGeneratedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // This adds createdAt and updatedAt automatically
});

// Index for better query performance
captureSchema.index({ url: 1, createdAt: -1 });
captureSchema.index({ timestamp: -1 });

// Virtual for content preview
captureSchema.virtual('contentPreview').get(function() {
    return this.content.substring(0, 200) + '...';
});

// Method to get word count
captureSchema.methods.getWordCount = function() {
    return this.content.split(/\s+/).length;
};

// Static method to find captures by URL
captureSchema.statics.findByUrl = function(url) {
    return this.find({ url: new RegExp(url, 'i') });
};

// Pre-save middleware to update word count
captureSchema.pre('save', function(next) {
    this.wordCount = this.getWordCount();
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Capture', captureSchema); 