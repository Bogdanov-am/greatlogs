from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import ExperimentAttachment
from ..schemas import ExperimentAttachmentSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import date

bp = Blueprint('experiment_attachments', __name__, url_prefix='/experiment_attachments')

experiment_attachment_schema = ExperimentAttachmentSchema()
experiment_attachments_schema = ExperimentAttachmentSchema(many=True)

@bp.route('', methods=['POST'])
def create_log():
    if 'file' not in request.files:
        return jsonify({"error": "No file upload"}), 400
    attachment = request.files['file']
    filepath = save_and_get_filepath(attachment, upload_dir="server_uploads", allowed_extensions={'.tlog'})
    if not filepath:
        return jsonify({"error": "File saving failed"}), 200
    
    experiment_id = request.form.get('experiment_id')
    if not experiment_id:
        return jsonify({"error": "experiment_id is required"}), 400
    
    try:
        log_data = {
            'experiment_id': int(experiment_id),
            'file_path': filepath,
            'upload_time': date.today()
        }
        attachment_file = experiment_attachment_schema.load(log_data)

        db.session.add(attachment_file)
        db.session.commit()
        return experiment_attachment_schema.jsonify(attachment_file)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 50



# @bp.route('', methods=['GET'])
# def list_experiment_attachments():
#     all_experiment_attachments = ExperimentAttachment.query.all()
#     return experiment_attachments_schema.jsonify(all_experiment_attachments)


# @bp.route('/<int:id>', methods=['GET'])
# def get_experiment_attachment(id):
#     experiment_attachment = ExperimentAttachment.query.get_or_404(id)
#     return experiment_attachment_schema.jsonify(experiment_attachment)

