from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import Event, Experiment, ExperimentDevice, Device, DeviceRecord, Parametres
from ..schemas import EventSchema
from datetime import datetime
from flask_cors import CORS

bp = Blueprint('allExperimentData', __name__, url_prefix='/api/all-experiment-data')
CORS(bp)

@bp.route('/<int:experiment_id>', methods=['GET'])
def get_experiment_details(experiment_id):
    print('In allExperimentData')
    try:
        experiment = db.session.query(Experiment).filter_by(experiment_id=experiment_id).first()
        if not experiment:
            return jsonify({'error': 'Experiment not found'}), 404

        # Основная информация с проверками на None
        result = {
            'id': experiment.experiment_id,
            'created_date': experiment.created_date,
            'description': experiment.description,
            'report_file': experiment.report_path,
            'responsible_operator': experiment.responsible.operator_name if experiment.responsible else None,
            'creator_operator': experiment.creator.operator_name if experiment.creator else None,
            'location': experiment.experiment_locations[0].location.location_name if experiment.experiment_locations else None,
            'operators': [op.operator.operator_name for op in experiment.experiment_operators if op.operator],
            'devices': [],
            'events': [],
            'logs': [],
            'screenshots': [],
            'screen_recordings': [],
            'attachments': [],
            'parameters': []
        }

        experiment_devices = db.session.query(ExperimentDevice).filter_by(experiment_id=experiment_id).all()
        device_ids = [ed.device_id for ed in experiment_devices]
        
        # Получаем информацию об устройствах
        devices_info = {
            d.device_id: {
                'type': d.device_type,
                'mavlink_id': d.mavlink_system_id
            }
            for d in db.session.query(Device).filter(Device.device_id.in_(device_ids)).all()
        }

        # Получаем видео для устройств
        device_videos = {}
        for dr in db.session.query(DeviceRecord).filter_by(experiment_id=experiment_id).all():
            if dr.record_path:
                if dr.device_id not in device_videos:
                    device_videos[dr.device_id] = []
                device_videos[dr.device_id].append(dr.record_path)

        # Получаем параметры для устройств
        device_parameters = {}
        for param in db.session.query(Parametres).filter_by(experiment_id=experiment_id).all():
            if param.device_id not in device_parameters:
                device_parameters[param.device_id] = []
            device_parameters[param.device_id].append(param.file_path)

        # Формируем список устройств
        for device_id in device_ids:
            if device_id in devices_info:
                result['devices'].append({
                    'type': devices_info[device_id]['type'],
                    'mavlink_id': devices_info[device_id]['mavlink_id'],
                    'onboard_video': device_videos.get(device_id, []),
                    'parameters_files': device_parameters.get(device_id, [])
                })


        # События с проверкой на None
        for event in experiment.events:
            result['events'].append({
                'time': event.event_time.strftime('%H:%M:%S') if event.event_time else None,
                'description': event.description,
                'devices': [ed.device.mavlink_system_id for ed in event.event_devices if ed.device]
            })

        # Логи с проверкой на None
        for log in experiment.log_files:
            result['logs'].append({
                'path': log.file_path,
                'devices': [ld.device.mavlink_system_id for ld in log.log_files if ld.device]
            })

        # Медиа и файлы с проверкой на None
        for screenshot in experiment.operator_screenshots:
            result['screenshots'].append({
                'path': screenshot.screenshot_path,
                'description': screenshot.screenshot_description
            })

        for recording in experiment.operator_records:
            if recording.record_path:
                result['screen_recordings'].append(recording.record_path)

        for attachment in experiment.attachments:
            if attachment.file_path:
                result['attachments'].append(attachment.file_path)

        for param in experiment.parametres:
            if param.device and param.file_path:
                result['parameters'].append({
                    'device_id': param.device.mavlink_system_id,
                    'path': param.file_path
                })

        print(result)
        return jsonify(result)

    except Exception as e:
        print(f"Error: {str(e)}")  # Логирование ошибки для отладки
        return jsonify({'error': str(e)}), 500
