from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import Event, Experiment
from ..schemas import EventSchema
from datetime import datetime

bp = Blueprint('events', __name__, url_prefix='/events')

event_schema = EventSchema()

@bp.route('', methods=['POST'])
def create_event():
    data = request.get_json()

    if not data:
        return jsonify({"error": "data is empty"}), 400
    
    if 'description' not in data:
        return jsonify({"error": "Нет описпния события"}), 400
    
    if 'event_time' not in data:
        return jsonify({"error": "Нет времени события"}), 400
    
    try:
        experiment_id = data['experiment_id']
        
        try:
            event_time = datetime.strptime(data['event_time'], '%Y-%m-%d %H:%M')
        except:
            return jsonify({"error": "Неверный формат датыю. Используйте HH:MM"}), 400
        
        event_data = {
            'description': data['description'],
            'event_time': event_time,
            'experiment_id': experiment_id,
        }

        errors = event_schema.validate(event_data)
        if errors:
            return jsonify({"error": errors}), 400

        event = Event(**event_data)
        db.session.add(event)     
        db.session.commit()
        
        return event_schema.jsonify(event), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500