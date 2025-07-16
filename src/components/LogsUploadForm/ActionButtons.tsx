import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { ActionButtonsProps } from "../../types/LogsUploadTypes";

const ActionButtons: React.FC<ActionButtonsProps> = ({
    onCancel,
    onCancelLogs,
    onNext,
    isNextDisabled,
    hasFiles,
}) => (
    <Row>
        <Col>
            <Button
                variant="danger"
                className="mt-3 w-100"
                onClick={onCancel}
            >
                Отменить
            </Button>
        </Col>
        <Col>
            <Button
                variant="outline-danger"
                className="mt-3 w-100"
                onClick={onCancelLogs}
                disabled={!hasFiles}
            >
                Стереть
            </Button>
        </Col>
        <Col>
            <div className="d-flex justify-content-end">
                <Button
                    variant="primary"
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