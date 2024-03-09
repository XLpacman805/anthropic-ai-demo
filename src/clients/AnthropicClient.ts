class AnthropicClient {
    apiKey: string;
    anthropicBaseUrl: string;
    constructor(anthropicBaseUrl: string, apiKey: string) {
        this.anthropicBaseUrl = anthropicBaseUrl;
        this.apiKey = apiKey;
    }

    public async createMessage(): Promise<string> {
        return 'Howdy world';
    }
}

export default AnthropicClient;