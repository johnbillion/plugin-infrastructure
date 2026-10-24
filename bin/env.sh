# Environment variables shared by the bin scripts. This file is sourced, not executed.

PLUGIN=$(jq -r .name package.json)

# The project name includes a hash of the checkout's real path so that two checkouts of the
# same plugin (eg git worktrees) get their own containers, network, and database. A value
# that is already set (eg in CI) is left alone so that plain `docker compose` commands match.
export PLUGIN_SLUG=${PLUGIN}
export COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME:-${PLUGIN}-$(pwd -P | shasum | cut -c1-8)}

# Shared with a host install of Composer, if there is one.
export COMPOSER_CACHE_DIR=${COMPOSER_CACHE_DIR:-${XDG_CACHE_HOME:-${HOME}/.cache}/composer}

# Files written by the containers are owned by the host user.
export PHP_FPM_UID=${PHP_FPM_UID:-$(id -u)}
export PHP_FPM_GID=${PHP_FPM_GID:-$(id -g)}
