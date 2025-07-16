from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import ExperimentOperatorScreenshot, Experiment
from ..schemas import ExperimentOperatorScreenshotSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import date

bp = Blueprint('experiment_screenshots', __name__, url_prefix='/experiment_screenshots')

screenshot_schema = ExperimentOperatorScreenshotSchema()
screenshots_schema = ExperimentOperatorScreenshotSchema(many=True)

@bp.route('', methods=['POST'])
def create_screenshot():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    description = request.form.get('description', '')
    experiment_id = request.form.get('experiment_id')
    
    filepath = save_and_get_filepath(
        file, 
        upload_dir="server_uploads", 
        allowed_extensions={'.png', '.jpg', '.jpeg', '.gif'}
    )
    
    if not filepath:
        return jsonify({"error": "Bad filepath"}), 400
    
    try:

        new_screenshot = ExperimentOperatorScreenshot(
            screenshot_path = filepath,
            experiment_id = experiment_id,
            screenshot_description = description,
            upload_date = date.today()
        )
        
        db.session.add(new_screenshot)
        db.session.commit()
        
        return screenshot_schema.jsonify(new_screenshot), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
