import os
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from typing import Optional, BinaryIO

S3_ENDPOINT = os.getenv("S3_ENDPOINT")  # e.g., http://localhost:9000 for MinIO
S3_REGION = os.getenv("S3_REGION", "us-east-1")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY", "minioadmin")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY", "minioadmin")
S3_BUCKET = os.getenv("S3_BUCKET", "ph-chatbot")


def _get_s3_client():
    kwargs = {
        "aws_access_key_id": S3_ACCESS_KEY,
        "aws_secret_access_key": S3_SECRET_KEY,
        "region_name": S3_REGION,
        "config": Config(signature_version="s3v4")
    }
    if S3_ENDPOINT:
        kwargs["endpoint_url"] = S3_ENDPOINT

    return boto3.client("s3", **kwargs)


def ensure_bucket_exists(bucket: Optional[str] = None):
    bucket = bucket or S3_BUCKET
    s3 = _get_s3_client()
    try:
        s3.head_bucket(Bucket=bucket)
    except ClientError:
        s3.create_bucket(Bucket=bucket)
    return bucket


def upload_fileobj(file_obj: BinaryIO, key: str, bucket: Optional[str] = None, content_type: Optional[str] = None):
    bucket = ensure_bucket_exists(bucket)
    s3 = _get_s3_client()
    extra_args = {}
    if content_type:
        extra_args["ContentType"] = content_type
    s3.upload_fileobj(file_obj, bucket, key, ExtraArgs=extra_args)
    return key


def download_fileobj(key: str, bucket: Optional[str] = None):
    bucket = bucket or S3_BUCKET
    s3 = _get_s3_client()
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        return response["Body"].read()
    except ClientError:
        return None


def generate_presigned_url(key: str, expires_in: int = 3600, bucket: Optional[str] = None):
    bucket = bucket or S3_BUCKET
    s3 = _get_s3_client()
    try:
        url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket, "Key": key},
            ExpiresIn=expires_in,
        )
        return url
    except ClientError:
        return None
