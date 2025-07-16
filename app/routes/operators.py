from flask import Blueprint, request
from ..app_db import db
from ..models import Operator
from ..schemas import OperatorSchema


bp = Blueprint('operators', __name__, url_prefix='/operators')

operator_schema = OperatorSchema()
operators_schema = OperatorSchema(many=True)


@bp.route('', methods=['GET'])
def list_operators():
    all_operators = Operator.query.all()
    return operators_schema.jsonify(all_operators)

