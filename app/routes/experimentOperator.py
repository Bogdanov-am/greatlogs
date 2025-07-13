from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import Experiment
from ..schemas import ExperimentSchema, ExperimentOperatorsSchema
from ..models import Operator, ExperimentOperators
from ..schemas import OperatorSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import datetime
from flask_cors import CORS

bp = Blueprint('experimentOperator', __name__, url_prefix='/experiment-operators')
CORS(bp)

experimentOperators_schema = ExperimentOperatorsSchema()

@bp.route('', methods=['POST'])
def save_experiment_operators():
    try:
        data = request.get_json()
        experiment_id = data['experiment_id']
        operator_ids = data['operator_ids']
        print('operator_ids: ', operator_ids)
        operators_data = []
        for operator_id in operator_ids:
            operator_data = {
                'experiment_id': experiment_id,
                'operator_id': operator_id
            }
            print(operator_data)
            validated_data = experimentOperators_schema.load(operator_data)
            print('validated_data')
            new_operator = ExperimentOperators(**validated_data)
            print('new_operator')
            db.session.add(new_operator)
            print('db.session')
            operators_data.append(operator_data)
            print('operators_data')
        
        db.session.commit()
        
        result = experimentOperators_schema.dump(operators_data, many=True)
        return jsonify({"success": True, "data": result}), 201
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500