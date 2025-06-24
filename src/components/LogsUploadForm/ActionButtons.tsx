import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { ActionButtonsProps } from "../../types/LogsUploadTypes";

const ActionButtons: React.FC<ActionButtonsProps> = ({
    onCancel,
    onNext,
    isNextDisabled,
    hasFiles,
}) => (
    <Row>
        <Col>
            <Button
                variant="outline-danger"
                className="mt-3 w-100"
                onClick={onCancel}
                disabled={!hasFiles}
            >
                Отменить
            </Button>
        </Col>
        <Col>
            <div className="d-flex justify-content-end">
                <Button
                    variant="primary"
                    disabled={isNextDisabled}
                    className="mt-3 w-100"
                    onClick={onNext}
                >
                    Далее
                </Button>
            </div>
        </Col>
    </Row>
);

export default ActionButtons;