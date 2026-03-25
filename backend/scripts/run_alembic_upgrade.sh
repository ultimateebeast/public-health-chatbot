#!/usr/bin/env bash
set -e

# Run Alembic upgrade head using project alembic directory
alembic -c ../alembic.ini upgrade head
