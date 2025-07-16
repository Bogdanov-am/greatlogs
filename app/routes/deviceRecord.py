from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import DeviceRecord
from ..schemas import DeviceRecordSchema
from ..models import Device
from ..schemas import DeviceSchema
from ..models import Experiment
from ..schemas import ExperimentSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import date

bp = Blueprint('deviceRecord', __name__, url_prefix='/device-records')

deviceRecord_schema = DeviceRecordSchema()

@bp.route('', methods=['POST'])
def create_device_record():   
    try:
        if 'file' not in request.files:
            return jsonify({"message": "файлы отсутствуют"}), 400
    
        files = request.files.getlist('file')
        if not files or all(file.filename == '' for file in files):
            return jsonify({"message": "No valid video files"}), 200

        experiment_id = request.form.get('experiment_id')
        device_id = request.form.get('device_id')

        responses = []
        for file in files:
            if file.filename == '':
                continue

            filepath = save_and_get_filepath(file, upload_dir="server_uploads")
            if not filepath:
                continue

            record_data = {
                'device_id': device_id,
                'record_path': filepath,
                'experiment_id': experiment_id,
            }
        
            record = deviceRecord_schema.load(record_data, session=db.session)
            db.session.add(record)
            responses.append(record_data)

        db.session.commit()
        return jsonify(responses), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"ошибка при сохранении видео: {str(e)}")
        return jsonify({"error": str(e)}), 500