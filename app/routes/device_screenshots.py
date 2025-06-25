from flask import Blueprint, request
from ..app_db import db
from ..models import ExperimentOperatorScreenshot
from ..schemas import ExperimentOperatorScreenshotSchema


bp = Blueprint('experiment_operator_screenshots', __name__, url_prefix='/experiment_operator_screenshots')

experiment_operator_screenshot_schema = ExperimentOperatorScreenshotSchema()
experiment_operator_screenshots_schema = ExperimentOperatorScreenshotSchema(many=True)


@bp.route('', methods=['POST'])
def create_experiment_operator_screenshot():
    data = request.get_json()
    experiment_operator_screenshot = experiment_operator_screenshot_schema.load(data)
    db.session.add(experiment_operator_screenshot)
    db.session.commit()
    return experiment_operator_screenshot_schema.jsonify(experiment_operator_screenshot)


@bp.route('', methods=['GET'])
def list_experiment_operator_screenshots():
    all_experiment_operator_screenshots = ExperimentOperatorScreenshot.query.all()
    return experiment_operator_screenshots_schema.jsonify(all_experiment_operator_screenshots)


@bp.route('/<int:id>', methods=['GET'])
def get_experiment_operator_screenshot(id):
    experiment_operator_screenshot = ExperimentOperatorScreenshot.query.get_or_404(id)
    return experiment_operator_screenshot_schema.jsonify(experiment_operator_screenshot)

