import React from 'react';
import { Button } from 'react-bootstrap';
import { EventActionsProps } from '../../types/EventInfoTypes'

const EventActions: React.FC<EventActionsProps> = ({
    showRemoveButton,
    onRemove,
}) => {
    if (!showRemoveButton) {
        return null;
    }

    return (
        <Button
            variant="outline-danger"
            onClick={onRemove}
            size="sm"
            className="mt-2"
        >
            Удалить событие
        </Button>
    );
};

export default EventActions;