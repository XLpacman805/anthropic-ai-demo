import { describe, beforeEach, test } from 'node:test';
import AnthropicClient, { AnthropicVersions, CreateMessageOptions, CreateMessageResponse, InputMessage, StopReason } from '../AnthropicClient.js';
import assert from 'node:assert';

interface CustomResponse extends Response {
    json: () => Promise<CreateMessageResponse>;
}

describe('AnthropicClient', () => {
    let client: AnthropicClient;
    const anthropicBaseUrl = 'localhost:3000/v1';
    const API_KEY = '0000-00000000-00000000-0000';
    const ANTHROPIC_VERSION: AnthropicVersions = '2023-06-01';

    beforeEach(() => {
        client = new AnthropicClient(anthropicBaseUrl, API_KEY);
    });

    test('constructor sets default values', () => {
        assert.strictEqual(client.anthropicBaseUrl, anthropicBaseUrl);
        assert.strictEqual(client.apiKey, API_KEY);
        assert.strictEqual(client.anthropicVersion, ANTHROPIC_VERSION);
    });

    test('constructor sets anthropicVersion from options', () => {
        const options = { anthropicVersion: ANTHROPIC_VERSION };
        const clientWithOptions = new AnthropicClient(anthropicBaseUrl, API_KEY, options);
        assert.strictEqual(clientWithOptions.anthropicVersion, options.anthropicVersion);
    });

    test('sends correct request', async () => {
        let fetchCalls: Array<{ url: URL | RequestInfo, options: RequestInit }> = [];
        const messages: InputMessage[] = [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there!' },
        ];
        const options: CreateMessageOptions = {
            systemPrompt: 'You are a helpful assistant.',
            model: 'claude-3-opus-20240229',
            maxTokens: 100,
        };
        const responseData: CreateMessageResponse = {
            content: [{ text: 'How can I assist you today?', type: 'text' }],
            id: 'message-id',
            model: options.model,
            role: 'assistant',
            stop_reason: 'end_turn' as StopReason,
            stop_sequence: null,
            type: 'message',
            usage: { input_tokens: 10, output_tokens: 20 },
        };
        const mockResponse: CustomResponse = {
            ...new Response(),
            json: () => Promise.resolve(responseData)
        };
        global.fetch = function (url, options) {
            // Record the fetch call
            fetchCalls.push({ url, options });

            // Return a promise that resolves with a custom response
            return Promise.resolve(mockResponse);
        };
        const response = await client.createMessage(messages, options);
        assert.deepEqual(fetchCalls[0].url, `${anthropicBaseUrl}/messages`);
        assert.deepEqual(fetchCalls[0].options.method, 'POST');
        const actualHeaders: Headers = fetchCalls[0].options.headers as Headers;
        assert.deepEqual(actualHeaders.get('anthropic-version'), ANTHROPIC_VERSION);
        assert.deepEqual(actualHeaders.get('x-api-key'), API_KEY);
        assert.deepEqual(fetchCalls[0].options.body, JSON.stringify({
            system: options.systemPrompt,
            model: options.model,
            max_tokens: options.maxTokens,
            messages,
        }));
        assert.deepEqual(response, responseData);
    });
});