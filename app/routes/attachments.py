from flask import Blueprint, request
from ..app_db import db
from ..models import ExperimentAttachment
from ..schemas import ExperimentAttachmentSchema


bp = Blueprint('experiment_attachments', __name__, url_prefix='/experiment_attachments')

experiment_attachment_schema = ExperimentAttachmentSchema()
experiment_attachments_schema = ExperimentAttachmentSchema(many=True)


@bp.route('', methods=['POST'])
def create_experiment_attachment():
    data = request.get_json()
    experiment_attachment = experiment_attachment_schema.load(data)
    db.session.add(experiment_attachment)
    db.session.commit()
    return experiment_attachment_schema.jsonify(experiment_attachment)


@bp.route('', methods=['GET'])
def list_experiment_attachments():
    all_experiment_attachments = ExperimentAttachment.query.all()
    return experiment_attachments_schema.jsonify(all_experiment_attachments)


@bp.route('/<int:id>', methods=['GET'])
def get_experiment_attachment(id):
    experiment_attachment = ExperimentAttachment.query.get_or_404(id)
    return experiment_attachment_schema.jsonify(experiment_attachment)

