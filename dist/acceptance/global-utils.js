import { execSync } from 'child_process';
export class GlobalUtils {
    constructor(options) {
        this.baseURL = options.baseURL;
        this.pluginSlug = options.pluginSlug;
    }
    /**
     * Run a WP-CLI command
     *
     * @throws Error if the command fails
     */
    runWPCLICommand(command) {
        const fullCommand = `docker compose exec --user wp_php wpcli wp --url="${this.baseURL}" ${command}`;
        try {
            const stdout = execSync(fullCommand, { encoding: 'utf8', cwd: process.cwd() });
            return stdout.trim();
        }
        catch (error) {
            throw new Error(`WP-CLI command failed: ${error.message}`);
        }
    }
    installWordPress() {
        // Install WordPress:
        this.runWPCLICommand('db reset --yes');
        this.runWPCLICommand(`core install --title="${this.pluginSlug}" --admin_user="admin" --admin_password="password" --admin_email="admin@example.com" --skip-email`);
        // Set a predictable permalink structure:
        this.runWPCLICommand('rewrite structure "/%postname%/"');
        // Activate the plugin under test:
        this.runWPCLICommand(`plugin activate ${this.pluginSlug}`);
    }
    /**
     * Check if current WordPress version meets minimum requirement
     *
     * @throws Error if unable to parse WordPress version
     */
    isWordPressVersionAtLeast(minVersion) {
        const wpVersion = this.runWPCLICommand('core version');
        // Extract major.minor version from WordPress version string
        // Examples: "6.2.1" -> "6.2", "6.9-alpha-60684" -> "6.9"
        // Use the last line of output to avoid PHP deprecation warnings polluting stdout
        const versionLine = wpVersion.split('\n').pop() || wpVersion;
        const versionMatch = versionLine.match(/^(\d+\.\d+)/);
        if (!versionMatch) {
            throw new Error(`Unable to parse WordPress version: ${wpVersion}`);
        }
        const currentVersion = parseFloat(versionMatch[1]);
        return currentVersion >= minVersion;
    }
}
