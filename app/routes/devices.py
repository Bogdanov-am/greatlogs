from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import Device, Experiment
from ..schemas import DeviceSchema, DeviceRecordSchema, ParametresSchema
from ..models import LogFile
from .fileSaveFunc import save_and_get_filepath
from datetime import date
import numpy
import fasttlogparser

bp = Blueprint('devices', __name__, url_prefix='/devices')

device_schema = DeviceSchema()

# devices_schema = DeviceSchema(many=True)

@bp.route('', methods=['GET'])
def share_device():
    file_log = db.session.query(LogFile).order_by(LogFile.file_path.desc()).first()
    print(file_log.file_path)
    messages, msg_ids = fasttlogparser.parseTLog(file_log.file_path)
    mavlink_system_id = list(msg_ids.keys())
    print(mavlink_system_id)
    return jsonify({"mavlink_system_id":mavlink_system_id})

@bp.route('', methods=['POST'])
def create_device():
    data = request.get_json()

    if not data:
        return jsonify({"error": "data is empty"}), 400

    if 'device_type' not in data:
        return jsonify({"error": "Нет типа аппарата"}), 400
    
    if 'mavlink_system_id' not in data:
        return jsonify({"error": "Нет типа аппарата"}), 400
    
    try:
        last_experiment = db.session.query(Experiment).order_by(Experiment.experiment_id.desc()).first()
        
        if not last_experiment:
            return jsonify({"error": "No experiments available"}), 400

        device_data = {
            'device_type': data['device_type'],
            'serial_number': 123,
            'mavlink_system_id': data['mavlink_system_id'],
        }
        
        errors = device_schema.validate(device_data)
        if errors:
            return jsonify({"error": errors}), 400
        
        device = Device(**device_data)
        db.session.add(device)        
        db.session.flush()        
        db.session.commit()

        response_data = {
            'device_id': device.device_id,
        }
        
        return jsonify(response_data), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
