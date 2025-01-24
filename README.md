# Plugin Infrastructure

Reusable infrastructure relating to testing, building, and deploying my WordPress plugins (see the "Used by" section below).

Provided without support, warranty, guarantee, backwards compatibility, fitness for purpose, resilience, safety, sanity, beauty, or support for any plugin that isn't one of mine.

## Used by

* [Extended CPTs](https://github.com/johnbillion/extended-cpts)
* [Query Monitor](https://github.com/johnbillion/query-monitor)
* [User Switching](https://github.com/johnbillion/user-switching)
* [WP Crontrol](https://github.com/johnbillion/wp-crontrol)

## Overview

Plugins that use this library all use a similar setup in their workflows:

### Acceptance testing

* Push to a main branch or pull request, `acceptance-tests.yml` fires
	* Constructs a matrix of supported PHP and WordPress versions
	* Uses `reusable-acceptance-tests.yml`
		* Installs PHP and WordPress
		* Runs the build
		* Runs acceptance testing with wp-browser

### Integration testing

* Push to a main branch or pull request, `integration-tests.yml` fires
	* Constructs a matrix of supported PHP and WordPress versions
	* Uses `reusable-integration-tests.yml`
		* Installs PHP and WordPress
		* Runs the build
		* Runs integration testing with wp-browser, once for:
			* Single site
			* Multisite

### Coding standards testing

* Push to a main branch or pull request, `coding-standards.yml` fires
	* Uses `reusable-coding-standards.yml`
		* Installs PHP
		* Checks coding standards with PHPCS

### Static analysis

* Push to a main branch or pull request, `static-analysis.yml` fires
	* Constructs a matrix of supported PHP versions
	* Uses `reusable-static-analysis.yml`
		* Installs PHP
		* Runs static analysis with PHPStan

### Workflow file linting

* Push to a main branch or pull request, `lint-workflows.yml` fires
	* Uses `reusable-workflow-lint.yml`
		* Lints all GitHub Actions workflow files for correctness and security using:
			* ActionLint
			* Octoscan
			* Zizmor
			* Poutine
			* OpenSSF Scorecard
		* Uploads results to GitHub Code Scanning

### Deployment to WordPress.org

* Push to the `release` branch, `build.yml` fires
	* Uses `reusable-build.yml`
		* Runs the build
		* Reads version from `package.json`
		* Commits built files
		* Pushes to `release-$VERSION`
		* Tags the new version and pushes
		* Creates a draft release
* Publish the release, `deploy-tag.yml` fires
	* Uses `reusable-deploy-tag.yml`
		* Creates a changelog entry from the release notes
		* Uses `10up/action-wordpress-plugin-deploy`
			* Deploys the new version to WordPress.org
			* Generates a zip file
		* Uses `johnbillion/action-wordpress-plugin-attestation`
			* Fetches the zip from WordPress.org
			* Generates a build provenance attestation if the zip contents matches the build
		* Closes the completed milestone for the release
		* Creates the next major, minor, and patch release milestones

## Licence

MIT
