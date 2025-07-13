from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import ExperimentAttachment, Experiment
from ..schemas import ExperimentAttachmentSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import date

bp = Blueprint('experiment_attachments', __name__, url_prefix='/experiment_attachments')

attachment_schema = ExperimentAttachmentSchema()
attachments_schema = ExperimentAttachmentSchema(many=True)

@bp.route('', methods=['POST'])
def create_attachment():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    experiment_id = request.form.get('experiment_id')
    
    filepath = save_and_get_filepath(
        file,
        upload_dir="server_uploads",
        allowed_extensions={'.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.zip'}
    )
    
    if not filepath:
        return jsonify({"error": "Bad filepath"}), 400
    
    try:
        new_attachment = ExperimentAttachment(
            file_path = filepath,
            experiment_id = experiment_id,
            upload_date = date.today()
        )
        
        db.session.add(new_attachment)
        db.session.commit()
        
        return attachment_schema.jsonify(new_attachment), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
