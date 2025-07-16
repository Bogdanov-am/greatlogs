
from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import Experiment, ExperimentDevice
from ..schemas import ExperimentSchema
from ..models import Operator
from ..schemas import ExperimentDeviceSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import datetime
from flask_cors import CORS

bp = Blueprint('experimentDevice', __name__, url_prefix='/experiment-device')
CORS(bp)

experimentDevice_schema = ExperimentDeviceSchema()

@bp.route('', methods=['POST'])
def create_experimentDevice():
    experiment_id = request.form.get('experiment_id')
    device_id = request.form.get('device_id')

    try:
        log_data = {
            'experiment_id': int(experiment_id),
            'device_id': device_id
        }

        log_file = experimentDevice_schema.load(log_data)
        db.session.add(log_file)
        db.session.commit()
        

        return experimentDevice_schema.jsonify(log_file)
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500