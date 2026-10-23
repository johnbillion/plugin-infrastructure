# Environment variables shared by the bin scripts. This file is sourced, not executed.

PLUGIN=$(jq -r .name package.json)

# The project name includes a hash of the checkout's real path so that two checkouts of the
# same plugin (eg git worktrees) get their own containers, network, and database. A value
# that is already set (eg in CI) is left alone so that plain `docker compose` commands match.
export PLUGIN_SLUG=${PLUGIN}
export COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME:-${PLUGIN}-$(pwd -P | shasum | cut -c1-8)}

# This package can be installed with either Composer or npm. The Docker config is read from
# whichever one the calling script came from. `$0` is the calling script, not this file.
if [ -z "${PLUGIN_INFRASTRUCTURE_PATH}" ]; then
	case "$0" in
		*/vendor/*) export PLUGIN_INFRASTRUCTURE_PATH=vendor/johnbillion/plugin-infrastructure ;;
		*) export PLUGIN_INFRASTRUCTURE_PATH=node_modules/@johnbillion/plugin-infrastructure ;;
	esac
fi

# Files written by the containers are owned by the host user.
export PHP_FPM_UID=${PHP_FPM_UID:-$(id -u)}
export PHP_FPM_GID=${PHP_FPM_GID:-$(id -g)}
