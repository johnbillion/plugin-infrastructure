export interface GlobalUtilsOptions {
    baseURL: string;
    pluginSlug: string;
}
export declare class GlobalUtils {
    private baseURL;
    private pluginSlug;
    constructor(options: GlobalUtilsOptions);
    /**
     * Run a WP-CLI command
     *
     * @throws Error if the command fails
     */
    runWPCLICommand(command: string): string;
    installWordPress(): void;
    /**
     * Check if current WordPress version meets minimum requirement
     *
     * @throws Error if unable to parse WordPress version
     */
    isWordPressVersionAtLeast(minVersion: number): boolean;
}
