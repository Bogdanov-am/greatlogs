from flask import Blueprint, request
from ..app_db import db
from ..models import Experiment
from ..schemas import ExperimentSchema
from datetime import date


bp = Blueprint('experiments', __name__, url_prefix='/experiments')

experiment_schema = ExperimentSchema()
experiments_schema = ExperimentSchema(many=True)


@bp.route('', methods=['POST'])
def create_experiment():
    data = request.get_json()
    experiment = experiment_schema.load(data)
    db.session.add(experiment)
    db.session.commit()
    return experiment_schema.jsonify(experiment)


@bp.route('', methods=['GET'])
def list_experiments():
    all_experiments = Experiment.query.all()
    return experiments_schema.jsonify(all_experiments)


@bp.route('/<int:id>', methods=['GET'])
def get_experiment(id):
    experiment = Experiment.query.get_or_404(id)
    return experiment_schema.jsonify(experiment)


