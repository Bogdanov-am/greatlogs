from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import ExperimentOperatorRecord, Experiment
from ..schemas import ExperimentOperatorRecordSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import date

bp = Blueprint('experiment_recordings', __name__, url_prefix='/experiment_recordings')

recording_schema = ExperimentOperatorRecordSchema()
recordings_schema = ExperimentOperatorRecordSchema(many=True)

@bp.route('', methods=['POST'])
def create_recording():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    experiment_id = request.form.get('experiment_id')
    
    filepath = save_and_get_filepath(
        file, 
        upload_dir="server_uploads", 
        allowed_extensions={'.mp4', '.avi', '.mov', '.mkv', '.txt'}
    )
    
    if not filepath:
        return jsonify({"error": "Bad filepath"}), 400
    
    try:
        new_recording = ExperimentOperatorRecord(
            record_path = filepath,
            experiment_id = experiment_id,
            upload_date = date.today()
        )
        
        db.session.add(new_recording)
        db.session.commit()
        
        return recording_schema.jsonify(new_recording), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
