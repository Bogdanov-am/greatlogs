from flask import Blueprint, request
from ..app_db import db
from ..models import LogFile
from ..schemas import LogFileSchema


bp = Blueprint('logs', __name__, url_prefix='/logs')

log_schema = LogFileSchema()
logs_schema = LogFileSchema(many=True)


@bp.route('', methods=['POST'])
def create_log():
    data = request.get_json()
    log = log_schema.load(data)
    db.session.add(log)
    db.session.commit()
    return log_schema.jsonify(log)


@bp.route('', methods=['GET'])
def list_logs():
    all_logs = LogFile.query.all()
    return logs_schema.jsonify(all_logs)


@bp.route('/<int:id>', methods=['GET'])
def get_log(id):
    log = LogFile.query.get_or_404(id)
    return log_schema.jsonify(log)

