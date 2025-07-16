from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import Experiment
from ..schemas import ExperimentSchema
from ..models import Operator
from ..schemas import OperatorSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import datetime
from flask_cors import CORS

bp = Blueprint('experiments', __name__, url_prefix='/experiments')
CORS(bp)

experiment_schema = ExperimentSchema()

@bp.route('', methods=['POST'])
def create_experiment():
    if not request.content_type or 'multipart/form-data' not in request.content_type:
        return jsonify({"error": "Content-Type must be multipart/form-data"}), 415
    
    try:
        errors = []
        
        if 'file' not in request.files or not request.files['file']:
            errors.append("Файл отчёта")
        else:
            experiment_file = request.files['file']
        
        who_created = request.form.get('creator')
        if not who_created:
            errors.append("Создатель записи")
        
        who_responsible = request.form.get('responsible')
        if not who_responsible:
            errors.append("Ответственный оператор")
    
        description = request.form.get('description')
        if not description or not description.strip():
            errors.append("Описание")
        
        experiment_date = request.form.get('created_date')
        if not experiment_date:
            errors.append("Дата эксперимента")
    
        if errors:
            return jsonify({"error": f"Заполните обязательные поля: {', '.join(errors)}"}), 400

        # Сохраняем файл
        filepath = save_and_get_filepath(
            experiment_file, 
            upload_dir="server_uploads", 
            allowed_extensions={'.txt', '.pdf', '.doc', '.docx'}  # Расширите по необходимости
        )
        if not filepath:
            return jsonify({"error": "File saving failed"}), 400

        exp_data = {
            'description': description.strip(),
            'creator': int(who_created),
            'responsible': int(who_responsible),
            'report_path': filepath,
            'created_date': experiment_date.strip()
        }
        
        new_experiment = experiment_schema.load(exp_data)
        db.session.add(new_experiment)
        db.session.commit()

        response_data = {
            'experiment_id': new_experiment.experiment_id,
            'created_date': new_experiment.created_date,
            'description': new_experiment.description,
        }
        
        return jsonify(response_data), 201
        
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Некорректные данные: {str(e)}"}), 400
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500
