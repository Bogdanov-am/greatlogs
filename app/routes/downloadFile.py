from flask import send_file
import os
from flask import Blueprint, request, jsonify
# from ..app_db import db
from ..models import Event, Experiment, ExperimentDevice, Device, DeviceRecord, Parametres
from ..schemas import EventSchema
from datetime import datetime
from flask_cors import CORS

bp = Blueprint('downloadFile', __name__, url_prefix='/api/download')
CORS(bp)

@bp.route('', methods=['GET'])
def download_file():
    try:
        filename = request.args.get('path')
        if not filename:
            return jsonify({'error': 'Filename parameter is required'}), 400
        
        # Безопасное извлечение имени файла
        filename = os.path.basename(filename.replace('\\', '/'))
        
        UPLOAD_FOLDER = os.path.abspath(os.path.join(
            os.path.dirname(__file__), 
            '../../server_uploads'
        ))
        
        full_path = os.path.join(UPLOAD_FOLDER, filename)
        
        if not os.path.exists(full_path):
            return jsonify({'error': 'File not found'}), 404
            
        return send_file(
            full_path,
            as_attachment=True,
            download_name=filename)
            
    except Exception as e:
        print(f"Download error: {str(e)}")
        return jsonify({'error': str(e)}), 500
