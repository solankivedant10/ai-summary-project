const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const Capture = require('../models/Capture');
const { summarizeContent, generateQuickSummary } = require('../services/gemini');

// Middleware to check validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation Failed',
            details: errors.array()
        });
    }
    next();
};

// POST /api/capture
router.post(
    '/capture',
    [
        body('url').isURL().withMessage('Invalid or missing URL'),
        body('content').isLength({ min: 10 }).withMessage('Content is too short'),
        body('title').optional().isString().isLength({ max: 200 }),
        body('timestamp').optional().isISO8601().toDate(),
        body('wordCount').optional().isInt({ min: 1 }),
        body('contentLength').optional().isInt({ min: 1 }),
    ],
    validate,
    async (req, res) => {
        try {
            const { url, title, content, wordCount, contentLength, timestamp } = req.body;

            const capture = new Capture({
                url,
                title: title || 'Untitled',
                content: content.substring(0, 50000),
                wordCount: wordCount || content.split(/\s+/).length,
                contentLength: contentLength || content.length,
                timestamp: timestamp || new Date()
            });

            const savedCapture = await capture.save();

            console.log(`📝 Captured content from: ${url}`);
            console.log(`📊 Word count: ${savedCapture.wordCount}`);
            console.log(`⏰ Timestamp: ${savedCapture.timestamp}`);

            res.status(201).json({
                success: true,
                message: 'Content captured successfully',
                data: {
                    id: savedCapture._id,
                    url: savedCapture.url,
                    title: savedCapture.title,
                    wordCount: savedCapture.wordCount,
                    timestamp: savedCapture.timestamp
                }
            });
        } catch (error) {
            console.error('Error capturing content:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to capture content'
            });
        }
    }
);

// GET /api/captures
router.get('/captures', async (req, res) => {
    try {
        const captures = await Capture.find()
            .sort({ createdAt: -1 })
            .select('url title wordCount timestamp createdAt')
            .limit(100);

        res.json({
            success: true,
            count: captures.length,
            captures: captures.map(capture => ({
                id: capture._id,
                url: capture.url,
                title: capture.title,
                wordCount: capture.wordCount,
                timestamp: capture.timestamp,
                createdAt: capture.createdAt
            }))
        });
    } catch (error) {
        console.error('Error fetching captures:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch captures'
        });
    }
});

// GET /api/capture/:id
router.get(
    '/capture/:id',
    [param('id').isMongoId().withMessage('Invalid ID')],
    validate,
    async (req, res) => {
        try {
            const capture = await Capture.findById(req.params.id);
            if (!capture) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Capture not found'
                });
            }
            res.json({ success: true, data: capture });
        } catch (error) {
            console.error('Error fetching capture:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch capture'
            });
        }
    }
);

// DELETE /api/capture/:id
router.delete(
    '/capture/:id',
    [param('id').isMongoId().withMessage('Invalid ID')],
    validate,
    async (req, res) => {
        try {
            const deletedCapture = await Capture.findByIdAndDelete(req.params.id);
            if (!deletedCapture) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Capture not found'
                });
            }
            res.json({
                success: true,
                message: 'Capture deleted successfully',
                data: {
                    id: deletedCapture._id,
                    url: deletedCapture.url,
                    title: deletedCapture.title
                }
            });
        } catch (error) {
            console.error('Error deleting capture:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to delete capture'
            });
        }
    }
);

// GET /api/summarize/:id
router.get(
    '/summarize/:id',
    [param('id').isMongoId().withMessage('Invalid ID')],
    validate,
    async (req, res) => {
        try {
            const capture = await Capture.findById(req.params.id);
            if (!capture) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Capture not found'
                });
            }

            if (!capture.content) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'No content available for summarization'
                });
            }

            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            if (capture.summary && capture.summaryGeneratedAt > oneHourAgo) {
                return res.json({
                    success: true,
                    message: 'Using cached summary',
                    data: {
                        id: capture._id,
                        url: capture.url,
                        title: capture.title,
                        summary: capture.summary,
                        summaryGeneratedAt: capture.summaryGeneratedAt,
                        cached: true
                    }
                });
            }

            console.log(`🤖 Generating AI summary for: ${capture.url}`);
            const summary = await summarizeContent(capture.content, capture.url, capture.title);

            capture.summary = summary;
            capture.summaryGeneratedAt = new Date();
            await capture.save();

            console.log(`✅ Summary generated successfully for: ${capture.url}`);

            res.json({
                success: true,
                message: 'Summary generated successfully',
                data: {
                    id: capture._id,
                    url: capture.url,
                    title: capture.title,
                    summary,
                    summaryGeneratedAt: capture.summaryGeneratedAt,
                    cached: false
                }
            });
        } catch (error) {
            console.error('Error generating summary:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to generate summary',
                details: error.message
            });
        }
    }
);

// POST /api/summarize
router.post(
    '/summarize',
    [
        body('content').isLength({ min: 10 }).withMessage('Content is too short'),
        body('url').optional().isURL(),
        body('title').optional().isString().isLength({ max: 200 })
    ],
    validate,
    async (req, res) => {
        try {
            const { content, url, title } = req.body;

            console.log(`🤖 Generating AI summary for custom content`);
            const summary = await summarizeContent(content, url || '', title || '');

            res.json({
                success: true,
                message: 'Summary generated successfully',
                data: {
                    summary,
                    generatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Error generating custom summary:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to generate summary',
                details: error.message
            });
        }
    }
);

module.exports = router;
