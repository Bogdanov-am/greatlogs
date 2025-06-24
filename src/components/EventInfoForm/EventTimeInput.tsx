import React from "react";
import { Form } from "react-bootstrap";
import { EventTimeInputProps } from '../../types/EventInfoTypes'

const EventTimeInput: React.FC<EventTimeInputProps> = ({
    time,
    onChange,
    onBlur,
    shouldHighlightError,
}) => (
    <Form.Group className="mb-3">
        <Form.Label>
            <h6>Время события</h6>
        </Form.Label>
        <Form.Control
            type="time"
            value={time}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            style={{ border: shouldHighlightError ? "1px solid red" : "" }}
            required
        />
    </Form.Group>
);

export default EventTimeInput;
