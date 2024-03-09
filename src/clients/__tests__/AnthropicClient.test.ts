import { describe, it } from "node:test";
import AnthropicClient from "../AnthropicClient.js";
import assert from "node:assert";

describe('AnthropicClient test', {}, () => {
    const BASE_URL = 'localhost:3000/v1/messages';
    const API_KEY = '0000-000000000-00000000-0000';

    it('Posts a message to the anthropic api endpoint', async () => {
        const client = new AnthropicClient(BASE_URL, API_KEY);
        const expected = 'Howdy world';
        const actual = await client.createMessage();
        assert.strictEqual(actual, expected);
    });
});