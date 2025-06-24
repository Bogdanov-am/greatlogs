import React from "react";
import { Form } from "react-bootstrap";
import { EventDescriptionInputProps } from '../../types/EventInfoTypes';

const EventDescriptionInput: React.FC<EventDescriptionInputProps> = ({
    description,
    onChange,
    onBlur,
    shouldHighlightError,
}) => (
    <Form.Group className="mb-3">
        <Form.Label>
            <h6>Описание события</h6>
        </Form.Label>
        <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            style={{ border: shouldHighlightError ? "1px solid red" : "" }}
            placeholder="Описание события"
            required
        />
    </Form.Group>
);

export default EventDescriptionInput;
