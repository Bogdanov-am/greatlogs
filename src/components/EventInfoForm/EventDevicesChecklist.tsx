import React from 'react';
import { Form } from 'react-bootstrap';
import { EventDevicesChecklistProps } from '../../types/EventInfoTypes';

const EventDevicesChecklist: React.FC<EventDevicesChecklistProps> = ({
    devices,
    deviceIds,
    handleDeviceSelection,
}) => (
    <Form.Group className="mb-3">
        <Form.Label><h6>Участники события (аппараты)</h6></Form.Label>
        <div>
            {devices.map((device) => (
                <Form.Check
                    key={device.mavlinkSysId}
                    type="checkbox"
                    label={`Аппарат SYS_ID: ${device.mavlinkSysId}`}
                    checked={deviceIds.includes(device.mavlinkSysId)}
                    onChange={(e) => handleDeviceSelection(device.mavlinkSysId, e.target.checked)}
                />
            ))}
        </div>
    </Form.Group>
);

export default EventDevicesChecklist;