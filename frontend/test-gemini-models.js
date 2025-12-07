import { GoogleGenerativeAI } from '@google/generative-ai';

// Replace with your actual API key
const API_KEY = process.env.VITE_GEMINI_API_KEY || 'your_api_key_here';

async function listAvailableModels() {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);

        console.log('🔍 Fetching available models...\n');

        // List all available models
        const models = await genAI.listModels();

        console.log('✅ Available Models:\n');
        console.log('========================');

        for await (const model of models) {
            console.log(`\nModel: ${model.name}`);
            console.log(`Display Name: ${model.displayName}`);
            console.log(`Description: ${model.description}`);
            console.log(`Supported methods: ${model.supportedGenerationMethods?.join(', ')}`);
            console.log('------------------------');
        }

    } catch (error) {
        console.error('❌ Error fetching models:', error.message);
        console.error('\nMake sure your API key is valid and set in .env file');
    }
}

// Test a specific model
async function testModel(modelName) {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });

        console.log(`\n🧪 Testing model: ${modelName}`);
        const result = await model.generateContent('Say hello in one word');
        const response = result.response.text();

        console.log(`✅ Model works! Response: ${response}`);
        return true;
    } catch (error) {
        console.log(`❌ Model failed: ${error.message}`);
        return false;
    }
}

// Run the test
console.log('='.repeat(50));
console.log('  Gemini API Model Checker');
console.log('='.repeat(50));

listAvailableModels().then(async () => {
    console.log('\n\n🧪 Testing common models:');
    console.log('='.repeat(50));

    await testModel('gemini-pro');
    await testModel('gemini-1.5-flash');
    await testModel('gemini-1.5-pro');
    await testModel('models/gemini-pro');

    console.log('\n✅ Test complete!');
});
