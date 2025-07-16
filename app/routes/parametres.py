from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import Parametres
from ..schemas import ParametresSchema
from ..models import Device
from ..schemas import DeviceSchema
from ..models import Experiment
from ..schemas import ExperimentSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import date

bp = Blueprint('parametres', __name__, url_prefix='/device-parameters')

parameters_schema = ParametresSchema()

@bp.route('', methods=['POST'])
def create_device_parameters():
    try:
        if 'file' not in request.files:
            return jsonify({"message": "No parameter files uploaded"}), 200
            
        files = request.files.getlist('file')
        if not files or not files[0].filename:
            return jsonify({"message": "No valid parameter files"}), 200

        experiment_id = request.form.get('experiment_id')
        device_id = request.form.get('device_id')

        responses = []
        for file in files:
            if file.filename == '':
                continue
                
            filepath = save_and_get_filepath(file, upload_dir="server_uploads")
            if not filepath:
                continue

            params_data = {
                'device_id': device_id,
                'file_path': filepath,
                'experiment_id': experiment_id,
            }
            
            params = parameters_schema.load(params_data, session=db.session)
            db.session.add(params)
            responses.append(params_data)

        db.session.commit()
        return jsonify(responses), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
