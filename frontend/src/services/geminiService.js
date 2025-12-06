import { GoogleGenerativeAI } from '@google/generative-ai';

const AI_CONFIG = {
    model: 'gemini-1.5-flash',
    generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
    },
    safetySettings: [
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
    ],
};

class GeminiService {
    constructor() {
        this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        this.genAI = null;
        this.model = null;
        this.chat = null;
    }

    initialize() {
        if (!this.apiKey) {
            throw new Error('Gemini API key is not configured');
        }
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        // Use the full model name format
        this.model = this.genAI.getGenerativeModel({
            model: 'models/gemini-pro',
            generationConfig: AI_CONFIG.generationConfig,
            safetySettings: AI_CONFIG.safetySettings,
        });
    }

    buildSystemPrompt(context = {}) {
        const { vehicleType, problemCategory, isOnSolutionPage } = context;

        let prompt = `You are an expert vehicle breakdown diagnostic assistant. Your role is to help users diagnose and fix vehicle problems.

Core Responsibilities:
- Ask clarifying questions to accurately diagnose issues
- Provide step-by-step repair guidance
- Explain technical concepts in simple terms
- Suggest tool alternatives when needed
- Be encouraging and supportive

Communication Style:
- Use simple, clear language
- Ask one question at a time
- Provide confidence levels for diagnoses
- Offer safety warnings when relevant
- Be concise but thorough

`;

        if (vehicleType) {
            prompt += `\nContext: User has a ${vehicleType}.`;
        }

        if (problemCategory) {
            prompt += `\nProblem Category: ${problemCategory}`;
        }

        if (isOnSolutionPage) {
            prompt += `\n\nThe user is currently viewing a solution guide. Help them understand the steps, answer questions about the repair process, and provide alternatives if they lack specific tools.`;
        } else {
            prompt += `\n\nHelp the user describe their problem and diagnose the issue. Ask clarifying questions to narrow down the problem before suggesting solutions.`;
        }

        return prompt;
    }

    async startDiagnosticChat(vehicleType = null) {
        try {
            // Check if API key is configured
            if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here' || this.apiKey.trim() === '') {
                throw new Error('AI_NOT_CONFIGURED');
            }

            this.initialize();
            const systemPrompt = this.buildSystemPrompt({ vehicleType });

            this.chat = this.model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: systemPrompt }],
                    },
                    {
                        role: 'model',
                        parts: [{ text: 'I understand. I\'m ready to help diagnose and fix vehicle problems. I\'ll ask clarifying questions and provide clear guidance.' }],
                    },
                ],
            });

            return {
                message: `Hi! I'm your AI diagnostic assistant. ${vehicleType ? `I see you have a ${vehicleType}.` : ''} Can you describe what problem you're experiencing with your vehicle?`,
                isAI: true,
            };
        } catch (error) {
            if (error.message === 'AI_NOT_CONFIGURED') {
                throw new Error('AI feature is not configured. Please add your Gemini API key to use this feature.');
            }
            throw error;
        }
    }

    async startSolutionChat(problemData) {
        this.initialize();
        const systemPrompt = this.buildSystemPrompt({
            vehicleType: problemData.vehicleType,
            problemCategory: problemData.title,
            isOnSolutionPage: true,
        });

        const contextMessage = `The user is viewing a solution for: "${problemData.title}" on their ${problemData.vehicleType}.
Solution description: ${problemData.description || 'Repair guide for this specific problem.'}`;

        this.chat = this.model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'I understand. I\'m ready to help with this repair.' }],
                },
                {
                    role: 'user',
                    parts: [{ text: contextMessage }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'I\'m here to help you fix this issue. Feel free to ask any questions about the repair process!' }],
                },
            ],
        });

        return {
            message: `I can help you with fixing your ${problemData.vehicleType}'s ${problemData.title}. Feel free to ask:\n• What if I don't have a specific tool?\n• Can you explain a step in more detail?\n• What should I do if something doesn't work?`,
            isAI: true,
        };
    }

    async sendMessage(userMessage) {
        if (!this.chat) {
            throw new Error('Chat not initialized. Call startDiagnosticChat or startSolutionChat first.');
        }

        try {
            const result = await this.chat.sendMessage(userMessage);
            const response = result.response;
            const text = response.text();

            return {
                message: text,
                isAI: true,
                timestamp: new Date(),
            };
        } catch (error) {
            console.error('Gemini API Error:', error);

            if (error.message?.includes('API key')) {
                throw new Error('Invalid API key. Please check your Gemini API configuration.');
            }

            if (error.message?.includes('quota')) {
                throw new Error('AI service quota exceeded. Please try again later.');
            }

            throw new Error('Failed to get AI response. Please try again.');
        }
    }

    async getDiagnosis(symptoms) {
        this.initialize();

        const prompt = `Based on these symptoms, provide a diagnosis:

Symptoms: ${symptoms}

Provide:
1. Most likely problem (with confidence %)
2. 2-3 follow-up questions to confirm
3. Potential alternative diagnoses

Format:
**Diagnosis**: [Problem name] (Confidence: X%)
**Questions**:
- [Question 1]
- [Question 2]
**Alternatives**: [Other possibilities]`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            return response.text();
        } catch (error) {
            console.error('Diagnosis Error:', error);
            throw new Error('Failed to generate diagnosis. Please try again.');
        }
    }

    resetChat() {
        this.chat = null;
    }
}

export default new GeminiService();
