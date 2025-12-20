# Plugin Infrastructure

Reusable infrastructure relating to testing, building, linting, deploying, and verifying my WordPress plugins (see the "Used by" section below).

Provided without support, warranty, guarantee, backwards compatibility, fitness for purpose, resilience, safety, sanity, beauty, or support for any plugin that isn't one of mine.

## Used by

* [Extended CPTs](https://github.com/johnbillion/extended-cpts)
* [Query Monitor](https://github.com/johnbillion/query-monitor)
* [User Switching](https://github.com/johnbillion/user-switching)
* [WP Crontrol](https://github.com/johnbillion/wp-crontrol)

## Features

* Containerised test environment
* Support for an npm build step
* Acceptance testing
* Integration testing
* Coding standards testing
* Static analysis
* Workflow file linting
* Deployment to WordPress.org
* GitHub milestone management
* FAIR metadata generation
* GitHub build provenance attestation
* SLSA v1.0 Build level 3 facilitation
* Ongoing supply chain assurance

Plugins that use this library all use a similar setup in their workflows:

## Acceptance testing

* Push to a main branch or pull request, `acceptance-tests.yml` fires
	* Constructs a matrix of supported PHP and WordPress versions
	* Uses `reusable-acceptance-tests.yml`
		* Installs PHP and WordPress
		* Runs the build
		* Runs acceptance testing with Playwright

## Integration testing

* Push to a main branch or pull request, `integration-tests.yml` fires
	* Constructs a matrix of supported PHP and WordPress versions
	* Uses `reusable-integration-tests.yml`
		* Installs PHP and WordPress
		* Runs the build
		* Runs integration testing with PHPUnit, once for:
			* Single site
			* Multisite

## Coding standards testing

* Push to a main branch or pull request, `coding-standards.yml` fires
	* Uses `reusable-coding-standards.yml`
		* Installs PHP
		* Checks coding standards with PHPCS

## Static analysis

* Push to a main branch or pull request, `static-analysis.yml` fires
	* Constructs a matrix of supported PHP versions
	* Uses `reusable-static-analysis.yml`
		* Installs PHP
		* Runs static analysis with PHPStan

## Workflow file linting

* Push to a main branch or pull request, `lint-workflows.yml` fires
	* Uses `reusable-workflow-lint.yml`
		* Lints all GitHub Actions workflow files for correctness and security using:
			* ActionLint
			* Octoscan
			* Zizmor
			* Poutine
		* Uploads results to GitHub Code Scanning

## Deployment

### WordPress.org

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
		* Generates FAIR metadata for the release and opens a PR with the changes

### Packagist

* Happens automatically with each release via the auto-update mechanism on Packagist.org
* Always identical to the version deployed to WordPress.org

### GitHub

* Automatically closes the completed milestone for each release
* Automatically creates the next major, minor, and patch release milestones after each release

## Supply chain assurance

* Hourly scheduled workflow runs in `verify-distribution.yml`
	* Uses `reusable-verify-distribution.yml`
		* Verifies the provenance of the plugin on WordPress.org

## Licence

MIT
