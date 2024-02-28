const github = require('@actions/github');
const semver = require('semver');
const replace = require('replace-in-file');

const filename = process.argv[2] || 'readme.md';
const myToken = process.env.TOKEN;

async function run() {
	const api = new github.GitHub(myToken);

	const { data: releases } = await api.repos.listReleases( github.context.repo );

	let published = releases.filter( release =>
		! release.draft && ! release.prerelease
	);

	let sorted = published.sort( ( a, b ) =>
		semver.rcompare( semver.coerce( a.tag_name ), semver.coerce( b.tag_name ) )
	);

	let changelog = sorted.map( ( release ) => {
		const date = new Date( release.published_at ).toLocaleDateString(
			'en-gb',
			{
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}
		);

		return [
			`### ${release.tag_name} (${date}) ###`,
			'',
			`${release.body}`,
		].join('\n');
	} );

	// Show a maximum of 15 releases
	changelog = changelog.slice( 0, 15 );

	changelog.push(
		'### Earlier versions ###',
		`For the changelog of earlier versions, <a href="https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/releases">please refer to the releases page on GitHub</a>.`,
	);

	try {
		const results = await replace( {
			files: filename,
			from: '<!-- changelog -->',
			to: changelog.join( '\n\n' ),
		} );

		if ( results.filter( result => ! result.hasChanged ).length ) {
			console.error( 'No replacements made' );
			process.exitCode = 1;
		}
	} catch( exception ) {
		console.error( exception );
		process.exitCode = 1;
	}
}

run();
