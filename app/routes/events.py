from flask import Blueprint, request
from ..app_db import db
from ..models import Event
from ..schemas import EventSchema


bp = Blueprint('events', __name__, url_prefix='/events')

event_schema = EventSchema()
events_schema = EventSchema(many=True)


@bp.route('', methods=['POST'])
def create_event():
    data = request.get_json()
    event = event_schema.load(data)
    db.session.add(event)
    db.session.commit()
    return event_schema.jsonify(event)


@bp.route('', methods=['GET'])
def list_events():
    all_events = Event.query.all()
    return events_schema.jsonify(all_events)


@bp.route('/<int:id>', methods=['GET'])
def get_event(id):
    event = Event.query.get_or_404(id)
    return event_schema.jsonify(event)

