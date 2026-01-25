import { execSync } from 'child_process';

export interface GlobalUtilsOptions {
	baseURL: string;
	pluginSlug: string;
}

export class GlobalUtils {
	private baseURL: string;
	private pluginSlug: string;

	constructor( options: GlobalUtilsOptions ) {
		this.baseURL = options.baseURL;
		this.pluginSlug = options.pluginSlug;
	}

	/**
	 * Run a WP-CLI command
	 *
	 * @throws Error if the command fails
	 */
	runWPCLICommand( command: string ): string {
		const fullCommand = `docker compose exec --user wp_php wpcli wp --url="${this.baseURL}" ${command}`;

		try {
			const stdout = execSync( fullCommand, { encoding: 'utf8', cwd: process.cwd() } );
			return stdout.trim();
		} catch ( error: any ) {
			throw new Error( `WP-CLI command failed: ${error.message}` );
		}
	}

	installWordPress(): void {
		// Install WordPress:
		this.runWPCLICommand( 'db reset --yes' );
		this.runWPCLICommand( `core install --title="${this.pluginSlug}" --admin_user="admin" --admin_password="password" --admin_email="admin@example.com" --skip-email` );

		// Set a predictable permalink structure:
		this.runWPCLICommand( 'rewrite structure "/%postname%/"' );

		// Activate the plugin under test:
		this.runWPCLICommand( `plugin activate ${this.pluginSlug}` );
	}

	/**
	 * Check if current WordPress version meets minimum requirement
	 *
	 * @throws Error if unable to parse WordPress version
	 */
	isWordPressVersionAtLeast( minVersion: number ): boolean {
		const wpVersion = this.runWPCLICommand( 'core version' );
		// Extract major.minor version from WordPress version string
		// Examples: "6.2.1" -> "6.2", "6.9-alpha-60684" -> "6.9"
		const versionMatch = wpVersion.match( /^(\d+\.\d+)/ );
		if ( ! versionMatch ) {
			throw new Error( `Unable to parse WordPress version: ${wpVersion}` );
		}
		const currentVersion = parseFloat( versionMatch[1] );

		return currentVersion >= minVersion;
	}
}
