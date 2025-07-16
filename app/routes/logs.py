from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import LogFile
from ..schemas import LogFileSchema
from ..models import Experiment
from ..schemas import ExperimentSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import date
from sqlalchemy import select
# import fasttlogparser


bp = Blueprint('logs', __name__, url_prefix='/logs')

log_schema = LogFileSchema()
logs_schema = LogFileSchema(many=True)


@bp.route('', methods=['POST'])
def create_log():
    if 'file' not in request.files:
        return jsonify({"error": "No file upload"}), 400
    
    experiment_id = request.form.get('experiment_id');
    log = request.files['file']

    filepath = save_and_get_filepath(
        log,
        upload_dir="server_uploads",
        allowed_extensions={'.tlog'}
    )

    if not filepath:
        return jsonify({"error": "File saving failed"}), 400

    try:
        log_data = {
            'experiment_id': int(experiment_id),
            'file_path': filepath,
            'upload_time': date.today()
        }

        log_file = log_schema.load(log_data)
        db.session.add(log_file)
        db.session.commit()
        

        return log_schema.jsonify(log_file)
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500