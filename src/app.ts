import { configDotenv } from 'dotenv';
import AnthropicClient from './clients/AnthropicClient.js';

configDotenv();
const App = async (): Promise<string> => {
    const BASE_URL = process.env.ANTHROPIC_BASE_URL;
    const API_KEY = process.env.ANTHROPIC_API_KEY;
    const message = 'Tell what makes Anthropic AI models different than other offerings on the market.';
    const client = new AnthropicClient(BASE_URL, API_KEY, { anthropicVersion: '2023-06-01' });
    const response = await client.createMessage('claude-3-opus-20240229', [{
        content: message,
        role: 'user'
    }], 1024);
    console.log(response.content[0].text);
    return response.content[0].text;
};

export default App;
App();