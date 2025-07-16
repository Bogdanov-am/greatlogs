from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import Experiment, Device, ExperimentDevice, Location, ExperimentLocation
from datetime import date

bp = Blueprint('getExperimentCard', __name__, url_prefix='/api')

@bp.route('/experiment/<int:experiment_id>', methods=['GET'])
def get_experiment_card(experiment_id):
    """Получает данные для карточки эксперимента."""
    print(f"Request recived for experiment_id: {experiment_id}")
    try:
        experiment = Experiment.query.get_or_404(experiment_id)
        
        location = (
            db.session.query(Location.location_name)
            .join(ExperimentLocation, Location.location_id == ExperimentLocation.location_id)
            .filter(ExperimentLocation.experiment_id == experiment_id)
            .first()
        )
        
        devices = (
            db.session.query(Device.device_type, Device.mavlink_system_id)
            .join(ExperimentDevice, Device.device_id == ExperimentDevice.device_id)
            .filter(ExperimentDevice.experiment_id == experiment_id)
            .all()
        )
        
        equipment = ", ".join([f"{d.device_type} ({d.mavlink_system_id})" for d in devices])
        
        return jsonify({
            "experiment_id": experiment.experiment_id,
            "testDate": experiment.created_date,
            "description": experiment.description,
            "location": location[0] if location else "Не указано",
            "equipment": equipment or "Не указаны"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

