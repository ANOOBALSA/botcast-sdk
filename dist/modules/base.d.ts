import { BotcastClientConfig } from '../types/index.js';
export interface RequestOptions {
    method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
    path: string;
    query?: Record<string, string | number | boolean | undefined | null>;
    body?: any;
    headers?: Record<string, string>;
}
export declare class BaseModule {
    protected config: Required<BotcastClientConfig>;
    constructor(config: Required<BotcastClientConfig>);
    /**
     * Builds the instance-specific URL path prefix: `/:platform/:instanceId/:instanceToken/...`
     */
    protected buildPath(subPath: string): string;
    /**
     * Executes an HTTP request against the Botcast API Gateway with retry & error translation.
     */
    request<T = any>(options: RequestOptions): Promise<T>;
    private handleHttpError;
}
//# sourceMappingURL=base.d.ts.map