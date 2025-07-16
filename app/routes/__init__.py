from . import (
    devices, events, logs, attachments, operators, locations,
    experiments, parametres, deviceRecord, screenshots,
    operatorRecords, experimentDevice, experimentOperator,
    experimentLocation, eventDevice, getDeviceId, getExperimentCard,
    deleteExperimentCard, allExperimentData, downloadFile
)

def register_routes(app):
    app.register_blueprint(devices.bp)
    app.register_blueprint(events.bp)
    app.register_blueprint(logs.bp)
    app.register_blueprint(attachments.bp)
    app.register_blueprint(operators.bp)
    app.register_blueprint(locations.bp)
    app.register_blueprint(experiments.bp)
    app.register_blueprint(parametres.bp)
    app.register_blueprint(deviceRecord.bp)
    app.register_blueprint(screenshots.bp)
    app.register_blueprint(operatorRecords.bp)
    app.register_blueprint(experimentDevice.bp)
    app.register_blueprint(experimentOperator.bp)
    app.register_blueprint(experimentLocation.bp)
    app.register_blueprint(eventDevice.bp)
    app.register_blueprint(getDeviceId.bp)
    app.register_blueprint(getExperimentCard.bp)
    app.register_blueprint(deleteExperimentCard.bp)
    app.register_blueprint(allExperimentData.bp)
    app.register_blueprint(downloadFile.bp)
