from flask import Blueprint, request
from ..app_db import db
from ..models import ExperimentOperatorRecord
from ..schemas import ExperimentOperatorRecordSchema


bp = Blueprint('experiment_operator_records', __name__, url_prefix='/experiment_operator_records')

experiment_operator_record_schema = ExperimentOperatorRecordSchema()
experiment_operator_records_schema = ExperimentOperatorRecordSchema(many=True)


@bp.route('', methods=['POST'])
def create_experiment_operator_record():
    data = request.get_json()
    experiment_operator_record = experiment_operator_record_schema.load(data)
    db.session.add(experiment_operator_record)
    db.session.commit()
    return experiment_operator_record_schema.jsonify(experiment_operator_record)


@bp.route('', methods=['GET'])
def list_experiment_operator_records():
    all_experiment_operator_records = ExperimentOperatorRecord.query.all()
    return experiment_operator_records_schema.jsonify(all_experiment_operator_records)


@bp.route('/<int:id>', methods=['GET'])
def get_experiment_operator_record(id):
    experiment_operator_record = ExperimentOperatorRecord.query.get_or_404(id)
    return experiment_operator_record_schema.jsonify(experiment_operator_record)

