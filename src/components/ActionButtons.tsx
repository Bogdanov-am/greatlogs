import React from 'react';
import { Button } from 'react-bootstrap';
import { ActionButtonsProps } from '../types/PagesTypes';

const ActionButtons: React.FC<ActionButtonsProps> = ({ onBack, onNext }) => (
    <div className="d-flex justify-content-between mt-4">
        <Button variant="outline-secondary" onClick={onBack} size="lg">
            Назад
        </Button>
        <Button variant="primary" onClick={onNext} size="lg">
            Далее
        </Button>
    </div>
);

export default ActionButtons;
