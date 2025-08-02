# AI Summary Prompts

This file contains example prompts that can be used to process captured page content with AI services.

## Basic Summary Prompt

```
Please provide a concise summary of the following web page content in 2-3 paragraphs:

[CONTENT]

Focus on the main points, key insights, and important information. Make it easy to understand for someone who hasn't read the original content.
```

## Detailed Analysis Prompt

```
Analyze the following web page content and provide:

1. **Main Topic**: What is the primary subject?
2. **Key Points**: List 3-5 main takeaways
3. **Important Details**: Highlight crucial information
4. **Action Items**: What should the reader do with this information?
5. **Related Topics**: Suggest related areas to explore

Content:
[CONTENT]
```

## Research Summary Prompt

```
Please create a research summary of the following content:

**Source**: [URL]
**Title**: [TITLE]

**Content**:
[CONTENT]

Please provide:
- Executive Summary (2-3 sentences)
- Key Findings (bullet points)
- Methodology (if applicable)
- Implications
- Recommendations
```

## News Article Summary Prompt

```
Summarize this news article in a clear, objective manner:

**Headline**: [TITLE]
**Source**: [URL]

**Article Content**:
[CONTENT]

Please include:
- What happened
- Who was involved
- When it occurred
- Where it took place
- Why it matters
- Any relevant context or background
```

## Technical Documentation Summary Prompt

```
Please summarize this technical documentation:

**Document**: [TITLE]
**URL**: [URL]

**Content**:
[CONTENT]

Please provide:
- Purpose and scope
- Key concepts explained
- Important procedures or steps
- Technical requirements
- Common issues or troubleshooting tips
- Best practices mentioned
```

## Academic Paper Summary Prompt

```
Please provide an academic summary of this research paper:

**Title**: [TITLE]
**Source**: [URL]

**Content**:
[CONTENT]

Please include:
- Research question/hypothesis
- Methodology
- Key findings
- Conclusions
- Implications for the field
- Limitations of the study
```

## Custom Prompt Template

```
[YOUR_CUSTOM_PROMPT]

**Content to analyze**:
URL: [URL]
Title: [TITLE]
Content: [CONTENT]

[SPECIFIC_INSTRUCTIONS_FOR_AI]
```

## Usage Instructions

1. Replace `[CONTENT]`, `[URL]`, and `[TITLE]` with the actual captured data
2. Choose the appropriate prompt based on the type of content
3. Send to your preferred AI service (OpenAI, Claude, etc.)
4. Store the AI response alongside the original capture

## Integration Example

```javascript
// Example of how to use these prompts with the API
const prompt = `Please provide a concise summary of the following web page content in 2-3 paragraphs:

${capturedContent.content}

Focus on the main points, key insights, and important information.`;

// Send to AI service and store result
const aiResponse = await sendToAIService(prompt);
``` 