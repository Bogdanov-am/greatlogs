import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import EventTimeInput from './EventTimeInput';
import EventDescriptionInput from './EventDescriptionInput';
import EventDevicesChecklist from './EventDevicesChecklist';
import EventActions from './EventActions';
import { EventItemProps } from '../../types/EventInfoTypes';

const EventItem: React.FC<EventItemProps & {
    shouldHighlightError: (fieldName: string, value: any) => boolean;
    markFieldAsTouched: (fieldName: string) => void;
}> = ({
    event,
    eventIndex,
    devices,
    onChange,
    onRemove,
    showRemoveButton,
    handleDeviceSelection,
    shouldHighlightError,
    markFieldAsTouched,
}) => {
    const handleBlur = (fieldName: string) => {
        markFieldAsTouched(`events[${eventIndex}].${fieldName}`);
    };

    return (
        <div className="text-start">
            <h5>Событие {eventIndex + 1}</h5>
            <Card key={eventIndex} className="mb-3 p-3">
                <Row>
                    <Col md={4}>
                        <EventTimeInput
                            time={event.time}
                            onChange={(time) => onChange(eventIndex, { ...event, time })}
                            onBlur={() => handleBlur('time')}
                            shouldHighlightError={shouldHighlightError(`events[${eventIndex}].time`, event.time)}
                        />
                    </Col>
                </Row>

                <EventDescriptionInput
                    description={event.description}
                    onChange={(description) => onChange(eventIndex, { ...event, description })}
                    onBlur={() => handleBlur('description')}
                    shouldHighlightError={shouldHighlightError(`events[${eventIndex}].description`, event.description)}
                />

                <EventDevicesChecklist
                    devices={devices}
                    deviceIds={event.deviceIds}
                    handleDeviceSelection={(deviceId, isChecked) => 
                        handleDeviceSelection(eventIndex, deviceId, isChecked)
                    }
                />

                <EventActions
                    showRemoveButton={showRemoveButton}
                    onRemove={() => onRemove(eventIndex)}
                />
            </Card>
        </div>
    );
};

export default EventItem;