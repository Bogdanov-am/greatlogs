from flask import Blueprint, request
from ..app_db import db
from ..models import Location
from ..schemas import LocationSchema


bp = Blueprint('locations', __name__, url_prefix='/locations')

location_schema = LocationSchema()
locations_schema = LocationSchema(many=True)


@bp.route('', methods=['GET'])
def list_locations():
    all_locations = Location.query.all()
    return locations_schema.jsonify(all_locations)