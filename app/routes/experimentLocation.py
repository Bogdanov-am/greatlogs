from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import Experiment
from ..schemas import ExperimentSchema, ExperimentLocationSchema
from ..models import Operator, ExperimentLocation
from ..schemas import OperatorSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import datetime
from flask_cors import CORS

bp = Blueprint('experimentLocation', __name__, url_prefix='/experiment-locations')
CORS(bp)

experimentLocation_schema = ExperimentLocationSchema()

@bp.route('', methods=['POST'])
def save_experiment_location():
    try:
        data = request.get_json()
        experiment_id = data['experiment_id']
        location_id = data['location_id']
        
        location_data = {
            'experiment_id': experiment_id,
            'location_id': location_id
        }
        validated_data = experimentLocation_schema.load(location_data)
        new_location = ExperimentLocation(**validated_data)
        db.session.add(new_location)
        db.session.commit()
        
        result = experimentLocation_schema.dump(new_location)
        return jsonify({"success": True, "data": result}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
