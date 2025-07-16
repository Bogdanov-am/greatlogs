from flask import Blueprint, jsonify, request, current_app
from ..models import (
    db,
    Experiment,
    ExperimentAttachment,
    ExperimentDevice,
    ExperimentOperatorRecord,
    ExperimentOperatorScreenshot,
    ExperimentOperators,
    ExperimentLocation,
    LogFile,
    LogDevices,
    DeviceRecord,
    Event,
    EventDevice,
    Parametres
)
from pathlib import Path

UPLOAD_DIR = Path(__file__).parent.parent.parent

bp = Blueprint('deleteExperimentCard', __name__, url_prefix='/api/experiments')

@bp.route('/<int:experiment_id>', methods=['DELETE'])
def delete_experiment(experiment_id):
    try:

        # Начинаем транзакцию
        db.session.begin_nested()

        # 1. Удаляем параметры и файлы
        parameters = Parametres.query.filter_by(experiment_id=experiment_id).all()
        for param in parameters:
            if param.file_path:
                file_path = UPLOAD_DIR / param.file_path
                print(f"АБСОЛЮТНЫЙ ПУТЬ ДЛЯ УДАЛЕНИЯ : {file_path.absolute()}")
                if file_path.exists():
                    file_path.unlink()
                try:
                    if file_path.exists():
                        file_path.unlink()
                        current_app.logger.info(f"Deleted parameter file: {file_path}")
                    else:
                        current_app.logger.warning(f"Parameter file not found: {file_path}")
                except Exception as e:
                    current_app.logger.error(f"Error deleting parameter file {file_path}: {str(e)}")
                    raise
        Parametres.query.filter_by(experiment_id=experiment_id).delete()


        # 2. Удаляем записи устройств и файлы
        device_records = DeviceRecord.query.filter_by(experiment_id=experiment_id).all()
        for record in device_records:
            if record.record_path:
                file_path = UPLOAD_DIR / record.record_path
                if file_path.exists():
                    file_path.unlink()
        DeviceRecord.query.filter_by(experiment_id=experiment_id).delete()

        # 3. Удаляем логи и связанные файлы
        log_files = LogFile.query.filter_by(experiment_id=experiment_id).all()
        log_ids = [log.log_id for log in log_files]
        
        # Удаляем связки устройств и логов
        if log_ids:
            LogDevices.query.filter(LogDevices.log_id.in_(log_ids)).delete()
        
        # Удаляем файлы логов
        for log in log_files:
            if log.file_path:
                file_path = UPLOAD_DIR / log.file_path
                print(f"АБСОЛЮТНЫЙ ПУТЬ ДЛЯ УДАЛЕНИЯ : {file_path.absolute()}")
                if file_path.exists():
                    file_path.unlink()
                if file_path.exists():
                    file_path.unlink()
        LogFile.query.filter_by(experiment_id=experiment_id).delete()

        # 4. Удаляем события и связки
        event_ids = [event.event_id for event in Event.query.filter_by(experiment_id=experiment_id).all()]
        if event_ids:
            EventDevice.query.filter(EventDevice.event_id.in_(event_ids)).delete()
        Event.query.filter_by(experiment_id=experiment_id).delete()

        # 5. Удаляем операторские скриншоты и файлы
        screenshots = ExperimentOperatorScreenshot.query.filter_by(experiment_id=experiment_id).all()
        for screenshot in screenshots:
            if screenshot.screenshot_path:
                file_path = UPLOAD_DIR / screenshot.screenshot_path
                if file_path.exists():
                    file_path.unlink()
        ExperimentOperatorScreenshot.query.filter_by(experiment_id=experiment_id).delete()

        # 6. Удаляем операторские записи и файлы
        operator_records = ExperimentOperatorRecord.query.filter_by(experiment_id=experiment_id).all()
        for record in operator_records:
            if record.record_path:
                file_path = UPLOAD_DIR / record.record_path
                if file_path.exists():
                    file_path.unlink()
        ExperimentOperatorRecord.query.filter_by(experiment_id=experiment_id).delete()

        # 7. Удаляем вложения и файлы
        attachments = ExperimentAttachment.query.filter_by(experiment_id=experiment_id).all()
        for attachment in attachments:
            if attachment.file_path:
                file_path = UPLOAD_DIR / attachment.file_path
                if file_path.exists():
                    file_path.unlink()
        ExperimentAttachment.query.filter_by(experiment_id=experiment_id).delete()

        # 8. Удаляем остальные связки (без файлов)
        ExperimentOperators.query.filter_by(experiment_id=experiment_id).delete()
        ExperimentLocation.query.filter_by(experiment_id=experiment_id).delete()
        ExperimentDevice.query.filter_by(experiment_id=experiment_id).delete()

        # 9. Удаляем сам эксперимент
        experiment = Experiment.query.get(experiment_id)
        if experiment:
    # Удаляем файл отчёта, если он есть
            if experiment.report_path:
                report_path = UPLOAD_DIR / experiment.report_path
                try:
                    if report_path.exists():
                        report_path.unlink()
                        current_app.logger.info(f"Удалён отчёт: {report_path}")
                except Exception as e:
                    current_app.logger.error(f"Ошибка удаления отчёта: {str(e)}")
        db.session.delete(experiment)


        db.session.commit()
        return jsonify({'message': 'Experiment and all related data (including files) deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting experiment {experiment_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500
