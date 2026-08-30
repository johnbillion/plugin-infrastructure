import type { TestType } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export function captureHtmlOnFailure( test: TestType<any, any> ): void {
	test.afterEach( async ( { page }, testInfo ) => {
		if ( testInfo.status !== 'failed' && testInfo.status !== 'timedOut' ) {
			return;
		}

		const html = await page.content();
		const htmlPath = path.join( testInfo.outputDir, 'page-content.html' );

		// Playwright only creates the output directory on demand, so it may not exist yet.
		fs.mkdirSync( testInfo.outputDir, { recursive: true } );
		fs.writeFileSync( htmlPath, html, 'utf8' );
		testInfo.attachments.push( {
			name: 'page-html',
			path: htmlPath,
			contentType: 'text/html',
		} );
	} );
}
