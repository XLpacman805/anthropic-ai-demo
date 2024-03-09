export type AnthropicVersions = '2023-01-01' | '2023-06-01'

export interface AnthropicClientOptions {
    anthropicVersion?: AnthropicVersions;
}

export type Models = 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229';

export interface CreateMessageOptions {
    system?: string; //system prompt
    metadata?: Record<string, string>,
    stop_sequences?: Array<string>,
    stream?: boolean,
    temperature?: number,
    top_p?: number,
    top_k?: number
}

export interface InputMessage {
    role: 'user' | 'assistant'
    content: string
}

/**
* "end_turn": the model reached a natural stopping point
* "max_tokens": we exceeded the requested max_tokens or the model's maximum
* "stop_sequence": one of your provided custom stop_sequences was generated
**/
export type StopReason = 'end_turn' | 'max_tokens' | 'stop_sequence';

export interface CreateMessageResponse {
    content: Array<
        {
            "text": string,
            "type": 'text' //currently the only supported type. May change in the future.
        }
    >,
    id: string,
    model: string,
    role: 'assistant',
    stop_reason: StopReason,
    stop_sequence: string | null,
    type: 'message',
    usage: {
        input_tokens: number,
        output_tokens: number
    }
};

class AnthropicClient {
    apiKey: string;
    anthropicBaseUrl: string;
    anthropicVersion: AnthropicClientOptions['anthropicVersion'];
    constructor(anthropicBaseUrl: string, apiKey: string, options?: AnthropicClientOptions) {
        this.anthropicBaseUrl = anthropicBaseUrl;
        this.apiKey = apiKey;
        this.anthropicVersion = options?.anthropicVersion ?? '2023-06-01';
    }

    public async createMessage(model: Models, messages: Array<InputMessage>, max_tokens: number, options?: CreateMessageOptions): Promise<CreateMessageResponse> {
        const headers = new Headers();
        headers.append("anthropic-version", this.anthropicVersion);
        headers.append("Content-Type", "application/json");
        headers.append("x-api-key", this.apiKey);
        const optionals: Record<string, any> = {};
        for (const [k, v] of Object.entries(options)) {
            if (v !== undefined && v !== null) {
                optionals[k] = v;
            }
        }

        const body = JSON.stringify({
            model ,
            max_tokens,
            messages: messages,
            ...(Object.keys(optionals).length > 0 ? { ...optionals as Partial<CreateMessageOptions> } : undefined)
        });
        const requestInit: RequestInit = {
            method: 'POST',
            headers,
            body,
            redirect: 'follow'
        }

        try {
            const response = await fetch(`${this.anthropicBaseUrl}/messages`, requestInit);
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default AnthropicClient;