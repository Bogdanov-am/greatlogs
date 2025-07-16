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

@bp.route('', methods=['GET'])
def share_device():
    experiment_id = request.args.get('experiment_id')
    
    if not experiment_id:
        return jsonify({"error": "Experiment ID is required"}), 400

    experiment_id = int(experiment_id)

    log_files = (
        db.session.query(LogFile)
        .filter(LogFile.experiment_id == experiment_id)
        .all()
    )
    
    if not log_files:
        return jsonify({"error": "No log files found for this experiment"}), 404
    
    device_nums = {}

    for log_file in log_files:
        try:
            messages, msg_ids = fasttlogparser.parseTLog(
                path = log_file.file_path,
                whitelist = ["PARAM_SET", "PARAM_VALUE"])

            current_device_nums = {sys_id:0 for sys_id in msg_ids.keys() if sys_id < 250}

            if "PARAM_SET" in messages:
                for i in range(0, len(messages["PARAM_SET"]['param_id'])):
                    if messages["PARAM_SET"]['param_id'][i] == b'BRD_SERIAL_NUM':
                        current_device_nums[messages["PARAM_SET"]['target_system'][i]] = int(messages["PARAM_SET"]['param_value'][i])

            if "PARAM_VALUE" in messages:
                for i in range(0, len(messages["PARAM_VALUE"]['param_id'])):
                    if messages["PARAM_VALUE"]['param_id'][i] == b'BRD_SERIAL_NUM':
                        current_device_nums[messages["PARAM_VALUE"]['sys_id'][i]] = int(messages["PARAM_VALUE"]['param_value'][i])

            print('current_device_nums', current_device_nums)
            device_nums.update(current_device_nums)

        except Exception as e:
            print(f"Error parsing log file {log_file.file_path}: {str(e)}")
            continue
    
    print('device_nums: ', device_nums)
    return jsonify(device_nums)


@bp.route('', methods=['POST'])
def create_device():
    data = request.get_json()

    if not data:
        return jsonify({"error": "data is empty"}), 400

    if 'device_type' not in data:
        return jsonify({"error": "Нет типа аппарата"}), 400
    
    if 'mavlink_system_id' not in data:
        return jsonify({"error": "Нет типа аппарата"}), 400
    
    if 'serial_number' not in data:
        return jsonify({"error": "Нет серийного номера"}), 400
    
    try:    
        existing_device = db.session.query(Device).filter(
            Device.device_type == data['device_type'],
            Device.serial_number == data['serial_number'],
            Device.mavlink_system_id == data['mavlink_system_id']
        ).first()

        if existing_device:
            return jsonify({
                'device_id': existing_device.device_id,
                'message': 'Device already exists'
            }), 200


        device_data = {
            'device_type': data['device_type'],
            'serial_number': data['serial_number'],
            'mavlink_system_id': data['mavlink_system_id'],
        }
        print(device_data)

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
