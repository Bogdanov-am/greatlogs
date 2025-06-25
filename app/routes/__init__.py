from . import (
    devices, events, logs, 
    device_records, attachments, device_screenshots
)

def register_routes(app):
    app.register_blueprint(devices.bp)
    app.register_blueprint(events.bp)
    app.register_blueprint(logs.bp)
    app.register_blueprint(device_records.bp)
    app.register_blueprint(attachments.bp)
    app.register_blueprint(device_screenshots.bp)
