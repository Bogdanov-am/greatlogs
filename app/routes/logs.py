from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import LogFile
from ..schemas import LogFileSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import date
# import fasttlogparser


bp = Blueprint('logs', __name__, url_prefix='/logs')

log_schema = LogFileSchema()
logs_schema = LogFileSchema(many=True)


@bp.route('', methods=['POST'])
def create_log():
    if 'file' not in request.files:
        return jsonify({"error": "No file upload"}), 400
    log = request.files['file']
    filepath = save_and_get_filepath(log, upload_dir="server_uploads", allowed_extensions={'.tlog'})
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
        log_file = log_schema.load(log_data)

        db.session.add(log_file)
        db.session.commit()
        return log_schema.jsonify(log_file)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 50





    # try:
    #     messages = fasttlogparser.parseTLog(filepath, ids=[(2, 2)])
    #     db.session.add(messages)
    #     db.session.commit()
    #     return jsonify({"messages": messages}), 200
        
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500



# @bp.route('', methods=['GET'])
# def list_logs():
#     all_logs = LogFile.query.all()
#     return logs_schema.jsonify(all_logs)


# @bp.route('/<int:id>', methods=['GET'])
# def get_log(id):
#     log = LogFile.query.get_or_404(id)
#     return log_schema.jsonify(log)

