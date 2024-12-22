import boto3

class ImageBucket(object):
    def __new__(cls, configs) -> any:
        if not hasattr(cls, 'instance'):
            cls.instance = super(ImageBucket, cls).__new__(cls)

            # AWS S3 Configuration
            AWS_S3_ENDPOINT = configs["s3_configs"]["endpoint_url"]
            AWS_ACCESS_KEY = configs["s3_configs"]["aws_access_key"]
            AWS_SECRET_KEY = configs["s3_configs"]["aws_secret_access_key"]
            AWS_BUCKET_NAME = configs["s3_configs"]["aws_bucket_name"]
            AWS_REGION = configs["s3_configs"]["region_name"]  # e.g., us-west-1

            # Initialize the S3 client
            cls.instance.s3_client = boto3.client(
                's3',
                aws_access_key_id=AWS_ACCESS_KEY,
                aws_secret_access_key=AWS_SECRET_KEY,
                endpoint_url=AWS_S3_ENDPOINT,
                region_name=AWS_REGION
            )

            cls.instance.bucket_name = AWS_BUCKET_NAME
            cls.instance.region_name = AWS_REGION
        return cls.instance
    
    def get_s3_client(self) -> any:
        return self.instance.s3_client
    
    def get_bucket_name(self) -> str:
        return self.instance.bucket_name

    def get_region_name(self) -> str:
        return self.instance.region_name
