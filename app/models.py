from .app_db import db
from datetime import datetime


class Experiment(db.Model):
    experiment_id = db.Column(db.Integer, primary_key=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    report_path = db.Column(db.String(512), nullable=False)
    created_date = db.Column(db.Date, nullable=False)
    who_created = db.Column(db.Text, db.ForeignKey('operator.operator_id'), nullable=False)
    who_responsible = db.Column(db.Text, db.ForeignKey('operator.operator_id'), nullable=False)

    log_files = db.relationship('LogFile', backref='experiment', lazy=True)
    events = db.relationship('Event', backref='experiment', lazy=True)
    device_records = db.relationship('DeviceRecord', backref='experiment', lazy=True)
    attachments = db.relationship('ExperimentAttachment', backref='experiment', lazy=True)
    operator_screenshots = db.relationship('ExperimentOperatorScreenshot', backref='experiment', lazy=True)
    operator_records = db.relationship('ExperimentOperatorRecord', backref='experiment', lazy=True)


class Device(db.Model):
    device_id = db.Column(db.Integer, primary_key=True, nullable=False)
    device_type = db.Column(db.Integer, nullable=False)
    serial_number = db.Column(db.Integer, nullable=False)
    mavlink_system_id = db.Column(db.Integer, nullable=False)

    event_devices = db.relationship('EventDevice', backref='device', lazy=True)
    log_devices = db.relationship('LogDevices', backref='device', lazy=True)
    device_records = db.relationship('DeviceRecord', backref='device', lazy=True)
    experiment_devices = db.relationship('ExperimentDevice', backref='device', lazy=True)


class Event(db.Model):
    event_id = db.Column(db.Integer, primary_key=True, nullable=False)
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.experiment_id'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    event_time = db.Column(db.Date, nullable=False)

    event_devices = db.relationship('EventDevice', backref='event', lazy=True)


class Operator(db.Model):
    operator_id = db.Column(db.Integer, primary_key=True, nullable=False)
    operator_name = db.Column(db.Text, nullable=False)

    experiment_operators = db.relationship('ExperimentOperators', backref='operator', lazy=True)
    who_createds= db.relationship('Experiment', foreign_keys='Experiment.who_created', backref='creator', lazy=True)
    who_responsibles= db.relationship('Experiment', foreign_keys='Experiment.who_responsible', backref='responsible', lazy=True)

class LogFile(db.Model):
    log_id = db.Column(db.Integer, primary_key=True, nullable=False)
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.experiment_id'), nullable=False)
    file_path = db.Column(db.String(512), nullable=False)
    upload_time = db.Column(db.Date, nullable=False)

    log_files = db.relationship('LogDevices', backref='log_file', lazy=True)


class Location(db.Model):
    location_id = db.Column(db.Integer, primary_key=True, nullable=False)
    location_name = db.Column(db.Text, nullable=False)

    locations = db.relationship('ExperimentLocation', backref='location', lazy=True)


class ExperimentAttachment(db.Model):
    attachment_id = db.Column(db.Integer, primary_key=True, nullable=False)
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.experiment_id'), primary_key=True, nullable=False)
    file_path = db.Column(db.String(512), nullable=False)
    upload_date = db.Column(db.Date, nullable=False)


class ExperimentDevice(db.Model):
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.experiment_id'), primary_key=True, nullable=False)
    device_id = db.Column(db.Integer, db.ForeignKey('device.device_id'), primary_key=True, nullable=False)


class ExperimentOperatorRecord(db.Model):
    record_id = db.Column(db.Integer, primary_key=True, nullable=False)
    record_path = db.Column(db.String(512), nullable=False)
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.experiment_id'), primary_key=True, nullable=False)


class ExperimentOperatorScreenshot(db.Model):
    screenshot_id = db.Column(db.Integer, primary_key=True, nullable=False)
    screenshot_path = db.Column(db.String(512), nullable=False)
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.experiment_id'), primary_key=True, nullable=False)
    screenshot_description = db.Column(db.Text, nullable=False)


class ExperimentOperators(db.Model):
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.experiment_id'), primary_key=True, nullable=False)
    operator_id = db.Column(db.Integer, db.ForeignKey('operator.operator_id'), primary_key=True, nullable=False)


class ExperimentLocation(db.Model):
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.experiment_id'), primary_key=True, nullable=False)
    locatoin_id = db.Column(db.Integer, db.ForeignKey('location.location_id'), primary_key=True, nullable=False)


class LogDevices(db.Model):
    log_id = db.Column(db.Integer, db.ForeignKey('log_file.log_id'), primary_key=True, nullable=False)
    device_id = db.Column(db.Integer, db.ForeignKey('device.device_id'), primary_key=True, nullable=False)


class DeviceRecord(db.Model):
    device_record_id = db.Column(db.Integer, primary_key=True, nullable=False)
    device_id = db.Column(db.Integer, db.ForeignKey('device.device_id'), primary_key=True, nullable=False)
    record_path = db.Column(db.String(512), nullable=False)
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.experiment_id'), primary_key=True, nullable=False)


class EventDevice(db.Model):
    event_id = db.Column(db.Integer, db.ForeignKey('event.event_id'), primary_key=True, nullable=False)
    device_id = db.Column(db.Integer, db.ForeignKey('device.device_id'), primary_key=True, nullable=False)


