import React from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { Event, EventInfoProps } from '../../types/EventInfoTypes';
import EventItem from './EventItem';
import ActionButtons from "../ActionButtons";

const EventInfo: React.FC<EventInfoProps> = ({
    events,
    devices,
    onChange,
    onBack,
    onNext,
    shouldHighlightError,
    markFieldAsTouched,
}) => {
    const addEvent = () => {
        const newEvent: Event = {
            time: '',
            description: '',
            deviceIds: [],
        };
        onChange([...events, newEvent]);
    };

    const updateEvent = (index: number, event: Event) => {
        const newEvents: Event[] = [...events];
        newEvents[index] = event;
        onChange(newEvents);
    };

    const removeEvent = (index: number) => {
        const newEvents = events.filter((_, i) => i !== index);
        onChange(newEvents);
    };

    const handleDeviceSelection = (
        eventIndex: number,
        deviceId: string,
        isChecked: boolean
    ) => {
        const updatedEvents = [...events];
        if (isChecked) {
            updatedEvents[eventIndex].deviceIds = [
                ...updatedEvents[eventIndex].deviceIds,
                deviceId,
            ];
        } else {
            updatedEvents[eventIndex].deviceIds = updatedEvents[
                eventIndex
            ].deviceIds.filter((id) => id !== deviceId);
        }
        onChange(updatedEvents);
    };

    return (
        <Container>
            <h2 className="mb-4">События</h2>
            <Card className="p-4">
                <div className="mb-4">
                    {events.map((event, eventIndex) => (
                        <EventItem
                            key={eventIndex}
                            event={event}
                            eventIndex={eventIndex}
                            devices={devices}
                            onChange={updateEvent}
                            onRemove={removeEvent}
                            showRemoveButton={events.length > 1}
                            handleDeviceSelection={handleDeviceSelection}
                            shouldHighlightError={shouldHighlightError}
                            markFieldAsTouched={markFieldAsTouched}
                        />
                    ))}

                    <Button
                        variant="outline-primary"
                        onClick={addEvent}
                        size="sm"
                        className="mb-3"
                    >
                        + Добавить событие
                    </Button>
                </div>

                <ActionButtons onBack={onBack} onNext={onNext} />
            </Card>
        </Container>
    );
};

export default EventInfo;