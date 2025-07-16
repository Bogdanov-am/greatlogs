from .app_db import ma
from .models import *

class ExperimentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Experiment
        include_relationships = True
        load_instance = True


class DeviceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Device
        include_fk = True
        load_instance = True


class EventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event
        include_fk = True
        load_instance = True


class OperatorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Operator
        include_fk = True
        load_instance = True


class LogFileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = LogFile
        include_fk = True
        load_instance = True


class LocationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Location  
        include_fk = True
        load_instance = True


class ExperimentAttachmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ExperimentAttachment
        load_instance = True
        include_fk = True


class ExperimentDeviceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ExperimentDevice      
        load_instance = True
        include_fk = True


class ExperimentOperatorRecordSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ExperimentOperatorRecord       
        load_instance = True
        include_fk = True


class ExperimentOperatorScreenshotSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ExperimentOperatorScreenshot       
        load_instance = True
        include_fk = True


class ExperimentOperatorsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ExperimentOperators     
        include_fk = True


class LogDevicesSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = LogDevices    
        load_instance = True


class DeviceRecordSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = DeviceRecord    
        load_instance = True
        include_fk = True


class EventDeviceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EventDevice   
        load_instance = True
        include_fk = True


class ExperimentLocationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ExperimentLocation   
        include_fk = True

class ParametresSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Parametres
        load_instance = True
        include_fk = True