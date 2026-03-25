"""initial

Revision ID: 0001_initial
Revises: 
Create Date: 2026-02-07 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('firebase_uid', sa.String(length=255), nullable=False, unique=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True),
        sa.Column('display_name', sa.String(length=255), nullable=True),
        sa.Column('photo_url', sa.String(length=1024), nullable=True),
        sa.Column('theme', sa.String(length=32), nullable=True),
        sa.Column('language', sa.String(length=16), nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=False, server_default=sa.sql.expression.true()),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
        sa.Column('last_login_at', sa.DateTime, nullable=True),
    )

    op.create_table(
        'chat_history',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('messages', sa.JSON, nullable=True),
        sa.Column('title', sa.String(length=512), nullable=True),
        sa.Column('total_messages', sa.Integer, nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    op.create_table(
        'analytics',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('query_count', sa.Integer, nullable=False, server_default='0'),
        sa.Column('emergency_cases', sa.Integer, nullable=False, server_default='0'),
        sa.Column('avg_response_time_ms', sa.Float, nullable=False, server_default='0'),
        sa.Column('ml_accuracy', sa.Float, nullable=False, server_default='0'),
        sa.Column('sentiment_analysis_data', sa.JSON, nullable=True),
        sa.Column('intent_distribution', sa.JSON, nullable=True),
        sa.Column('recorded_date', sa.DateTime, nullable=True),
    )

    op.create_table(
        'health_reports',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('symptoms', sa.JSON, nullable=True),
        sa.Column('risk_level', sa.String(length=32), nullable=True),
        sa.Column('recommendations', sa.JSON, nullable=True),
        sa.Column('ml_diagnosis', sa.Text, nullable=True),
        sa.Column('emergency_flag', sa.Boolean, nullable=False, server_default=sa.sql.expression.false()),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    op.create_table(
        'refresh_tokens',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('token', sa.String(length=1024), nullable=False, unique=True),
        sa.Column('is_revoked', sa.Boolean, nullable=False, server_default=sa.sql.expression.false()),
        sa.Column('expires_at', sa.DateTime, nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )


def downgrade():
    op.drop_table('refresh_tokens')
    op.drop_table('health_reports')
    op.drop_table('analytics')
    op.drop_table('chat_history')
    op.drop_table('users')
