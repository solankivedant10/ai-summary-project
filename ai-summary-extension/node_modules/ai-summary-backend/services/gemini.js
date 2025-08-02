const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Summarize webpage content using Google Gemini API
 * @param {string} content - The webpage content to summarize
 * @param {string} url - The webpage URL (optional, for context)
 * @param {string} title - The webpage title (optional, for context)
 * @returns {Promise<Object>} JSON summary with key insights and suggestions
 */
async function summarizeContent(content, url = '', title = '') {
    try {
        // Validate API key
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Create the prompt
        const prompt = `
Summarize the following webpage content into a structured JSON response with 3 key insights and actionable suggestions.

Webpage Information:
- URL: ${url}
- Title: ${title}
- Content Length: ${content.length} characters

Content:
${content.substring(0, 30000)} // Limit content to avoid token limits

Please provide a JSON response in the following format:
{
  "summary": "A concise 2-3 sentence summary of the main content",
  "keyInsights": [
    "First key insight about the content",
    "Second key insight about the content", 
    "Third key insight about the content"
  ],
  "actionableSuggestions": [
    "First actionable suggestion based on the content",
    "Second actionable suggestion based on the content",
    "Third actionable suggestion based on the content"
  ],
  "contentType": "The type of content (e.g., 'article', 'news', 'documentation', 'blog post')",
  "estimatedReadingTime": "Estimated reading time in minutes",
  "wordCount": ${content.split(/\s+/).length}
}

Respond only with valid JSON, no additional text or formatting.
        `;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the JSON response
        let summaryData;
        try {
            // Clean up the response to extract JSON
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                summaryData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No valid JSON found in response');
            }
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', parseError);
            console.log('Raw response:', text);
            
            // Fallback response
            summaryData = {
                summary: "Unable to generate structured summary due to parsing error",
                keyInsights: [
                    "Content analysis was attempted but failed",
                    "Please try again or check the content format",
                    "Consider using a different content source"
                ],
                actionableSuggestions: [
                    "Try with different content",
                    "Check if the content is readable",
                    "Consider manual review"
                ],
                contentType: "unknown",
                estimatedReadingTime: "unknown",
                wordCount: content.split(/\s+/).length,
                error: "Failed to parse AI response"
            };
        }

        // Add metadata
        summaryData.metadata = {
            sourceUrl: url,
            sourceTitle: title,
            originalContentLength: content.length,
            generatedAt: new Date().toISOString(),
            model: "gemini-pro"
        };

        return summaryData;

    } catch (error) {
        console.error('Gemini API Error:', error);
        
        // Return error response
        return {
            summary: "Failed to generate summary due to API error",
            keyInsights: [
                "API service unavailable",
                "Check API key configuration",
                "Try again later"
            ],
            actionableSuggestions: [
                "Verify GEMINI_API_KEY is set correctly",
                "Check internet connection",
                "Contact support if issue persists"
            ],
            contentType: "error",
            estimatedReadingTime: "unknown",
            wordCount: content.split(/\s+/).length,
            error: error.message,
            metadata: {
                sourceUrl: url,
                sourceTitle: title,
                originalContentLength: content.length,
                generatedAt: new Date().toISOString(),
                model: "gemini-pro"
            }
        };
    }
}

/**
 * Generate a quick summary (shorter version)
 * @param {string} content - The webpage content
 * @returns {Promise<Object>} Quick summary
 */
async function generateQuickSummary(content) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
Provide a brief 2-3 sentence summary of this content in JSON format:

${content.substring(0, 15000)}

Response format:
{
  "quickSummary": "Brief summary here",
  "mainTopic": "Main topic of the content",
  "sentiment": "positive/negative/neutral"
}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('No valid JSON in response');
        }

    } catch (error) {
        console.error('Quick summary error:', error);
        return {
            quickSummary: "Unable to generate quick summary",
            mainTopic: "unknown",
            sentiment: "neutral",
            error: error.message
        };
    }
}

module.exports = {
    summarizeContent,
    generateQuickSummary
}; 