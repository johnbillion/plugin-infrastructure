import type { TestType } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export function captureHtmlOnFailure( test: TestType<any, any> ): void {
	test.afterEach( async ( { page }, testInfo ) => {
		if ( testInfo.status !== 'passed' ) {
			const html = await page.content();
			const htmlPath = path.join( testInfo.outputDir, 'page-content.html' );
			fs.writeFileSync( htmlPath, html, 'utf8' );
			testInfo.attachments.push( {
				name: 'page-html',
				path: htmlPath,
				contentType: 'text/html',
			} );
		}
	} );
}
