from flask import Blueprint, request, jsonify
from ..app_db import db
from ..models import EventDevice, Event, Device
from ..schemas import ExperimentSchema, EventDeviceSchema
from ..schemas import OperatorSchema
from .fileSaveFunc import save_and_get_filepath
from datetime import datetime
from flask_cors import CORS

bp = Blueprint('eventDevice', __name__, url_prefix='/event-devices')
CORS(bp)

event_device_schema = EventDeviceSchema()

@bp.route('', methods=['POST'])
def add_event_device():
    try:
        data = request.get_json()
        print("Данные запроса:", data)  # Логируем входящие данные

        # Проверка наличия обязательных полей
        if 'event_id' not in data or 'device_id' not in data:
            return jsonify({"error": "Требуются event_id и device_id"}), 400

        # Проверка существования Event и Device
        event = db.session.get(Event, data['event_id'])  # Используем .get() для поиска по PK
        device = db.session.get(Device, data['device_id'])
        
        if not event:
            return jsonify({"error": f"Event с id {data['event_id']} не найден"}), 404
        if not device:
            return jsonify({"error": f"Device с id {data['device_id']} не найден"}), 404

        # Создание записи
        event_device = EventDevice(
            event_id=data['event_id'],
            device_id=data['device_id']
        )
        db.session.add(event_device)
        db.session.commit()

        return jsonify({
            "EventDevice_id": event_device.EventDevice_id,
            "event_id": event_device.event_id,
            "device_id": event_device.device_id
        }), 201

    except Exception as e:
        db.session.rollback()
        print("Ошибка при создании EventDevice:", str(e))  # Детальный лог
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500

