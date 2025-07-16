import React, { useState } from 'react';
import { Button, Card, Container, Spinner } from 'react-bootstrap';
import { Event, EventInfoProps } from '../../types/EventInfoTypes';
import EventItem from './EventItem';
import { saveEventInfo } from '../../api';
import { handleCancel, handleCancelWithDelete } from '../../utils/handleCancel';

const EventInfo: React.FC<EventInfoProps> = ({
    experimentId,
    events,
    devices,
    onChange,
    onBack,
    onNext,
    shouldHighlightError,
    markFieldAsTouched,
    validateStep,
    onDeleteExperiment,
}) => {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleNextWithSave = async () => {
        setIsSubmitting(true)
        try {
            events.forEach((_, eventIndex) => {
                markFieldAsTouched(`events[${eventIndex}].description`);
                markFieldAsTouched(`events[${eventIndex}].time`);
            });

            if (!validateStep()) {
                throw new Error(
                    'Заполните все обязательные поля для каждого добавленного события'
                );
            }
            if (events.length > 0) {
                await saveEventInfo(events, experimentId);
            }            
            onNext();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert(
                error instanceof Error
                    ? error.message
                    : 'Ошибка сохранения событий'
            );
        } finally {
            setIsSubmitting(false);
        }
    }

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
                            showRemoveButton={events.length > 0}
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

                <div className="d-flex justify-content-between">
                    <Button
                        variant="danger"
                        onClick={() => handleCancelWithDelete(experimentId, onDeleteExperiment)}
                        disabled={isSubmitting}
                    >
                        Отменить
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleNextWithSave}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span className="ms-2">Сохранение...</span>
                            </>
                        ) : (
                            'Далее'
                        )}
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default EventInfo;