from flask import Blueprint, request
from ..app_db import db
from ..models import Device
from ..schemas import DeviceSchema


bp = Blueprint('devices', __name__, url_prefix='/devices')

device_schema = DeviceSchema()
devices_schema = DeviceSchema(many=True)


@bp.route('', methods=['POST'])
def create_device():
    data = request.get_json()
    device = device_schema.load(data)
    db.session.add(device)
    db.session.commit()
    return device_schema.jsonify(device)


@bp.route('', methods=['GET'])
def list_devices():
    all_devices = Device.query.all()
    return devices_schema.jsonify(all_devices)


@bp.route('/<int:id>', methods=['GET'])
def get_device(id):
    device = Device.query.get_or_404(id)
    return device_schema.jsonify(device)


