from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import Device, Experiment
from ..schemas import DeviceSchema, DeviceRecordSchema, ParametresSchema
from ..models import LogFile,ExperimentDevice

bp = Blueprint('getDeviceId', __name__, url_prefix='/find-by-experiment-and-mavlink')

@bp.route('', methods=['GET'])
def find_device_by_experiment_and_mavlink():
    experiment_id = request.args.get('experiment_id', type=int)
    mavlink_system_id = request.args.get('mavlink_system_id', type=int)
    print(experiment_id)
    print(mavlink_system_id)

    if not experiment_id or not mavlink_system_id:
        return jsonify({"error": "Требуются experiment_id и mavlink_system_id"}), 400

    try:
        experiment_device = db.session.query(ExperimentDevice).filter(
            ExperimentDevice.experiment_id == experiment_id
        ).first()
        if not experiment_device:
            return jsonify({
                "success": False,
                "message": "Эксперимент не найден"
            }), 404
        

        device = db.session.query(Device).join(ExperimentDevice)\
            .filter(
                ExperimentDevice.experiment_id == experiment_id,
                Device.mavlink_system_id == mavlink_system_id
            ).first()

        if not device:
            return jsonify({
                "success": False,
                "message": "Устройство не найдено"
            }), 404
        print(device)

        return jsonify({
            "success": True,
            "device_id": device.device_id,
            "device_type": device.device_type
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
