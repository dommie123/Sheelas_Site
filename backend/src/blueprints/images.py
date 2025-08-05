import os
import json

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from werkzeug.utils import secure_filename

from configs.s3 import ImageBucket

from constants import CORS_ALLOWED_ORIGINS


config_file = open(f'{os.getcwd()}\\backend\\src\\configs.json')
configs = json.load(config_file)

images_bp = Blueprint('images', __name__, url_prefix='/images')
image_bucket = ImageBucket(configs)
s3_client = image_bucket.get_s3_client()

@images_bp.route('/')
def admin_index():
    return jsonify({"message": "Welcome to the images panel."})


@images_bp.route('/upload', methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def upload_image():
    try:
        # Check if the request contains a file
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No file selected for uploading"}), 400

        # Secure the filename and prepare it for upload
        filename = secure_filename(file.filename)
        aws_bucket_name = image_bucket.get_bucket_name()
        aws_region_name = image_bucket.get_region_name()

        # Upload the file to S3
        s3_client.upload_fileobj(
            file,
            aws_bucket_name,
            filename,
            ExtraArgs={"ContentType": file.content_type}
        )
      
        # Generate the file URL
        file_url = f"https://{aws_bucket_name}.s3.{aws_region_name}.amazonaws.com/{aws_bucket_name}/{filename}"

        return jsonify({"message": "File uploaded successfully", "url": file_url}), 200

    except NoCredentialsError:
        return jsonify({"error": "AWS credentials not found"}), 500

    except PartialCredentialsError:
        return jsonify({"error": "Incomplete AWS credentials"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500