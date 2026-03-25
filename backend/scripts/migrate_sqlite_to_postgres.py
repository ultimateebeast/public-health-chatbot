"""Migrate data from local SQLite (dev) to Postgres target.

Usage:
    Set environment variable `SOURCE_SQLITE_URL` (defaults to sqlite:///./test.db)
    Set `DATABASE_URL` to your target Postgres URL.
    Then run: python migrate_sqlite_to_postgres.py
"""
import os
from sqlalchemy import create_engine, MetaData, Table, select
from sqlalchemy.exc import SQLAlchemyError


SOURCE_SQLITE_URL = os.getenv("SOURCE_SQLITE_URL", "sqlite:///./test.db")
TARGET_URL = os.getenv("DATABASE_URL")

if not TARGET_URL:
    raise RuntimeError("Set DATABASE_URL environment variable to target Postgres database")


def copy_table(source_engine, target_engine, table_name):
    source_meta = MetaData()
    target_meta = MetaData()
    source_meta.reflect(bind=source_engine, only=[table_name])
    target_meta.reflect(bind=target_engine, only=[table_name])

    source_table = source_meta.tables.get(table_name)
    target_table = target_meta.tables.get(table_name)
    if not source_table or not target_table:
        print(f"Skipping {table_name}: not found in both DBs")
        return

    with source_engine.connect() as s_conn, target_engine.connect() as t_conn:
        rows = s_conn.execute(select(source_table)).fetchall()
        if not rows:
            print(f"No rows for {table_name}")
            return
        for row in rows:
            data = dict(row._mapping)
            # Remove sqlite-specific rowid if present
            data.pop('rowid', None)
            try:
                t_conn.execute(target_table.insert().values(**data))
            except Exception as e:
                print(f"Failed to insert row into {table_name}: {e}")


def main():
    source_engine = create_engine(SOURCE_SQLITE_URL)
    target_engine = create_engine(TARGET_URL)

    # List of tables to copy (created by Alembic / models)
    tables = [
        'users',
        'chat_history',
        'analytics',
        'health_reports',
        'refresh_tokens'
    ]

    for t in tables:
        print(f"Copying table: {t}")
        try:
            copy_table(source_engine, target_engine, t)
        except SQLAlchemyError as e:
            print(f"Error copying {t}: {e}")

    print("Data copy completed")


if __name__ == '__main__':
    main()
