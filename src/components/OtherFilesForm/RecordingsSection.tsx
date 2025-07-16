import React from "react";
import { Button, Form } from "react-bootstrap";
import FileInputRow from "./FileInputRow";
import { RecordingsSectionProps } from '../../types/OtherFilesTypes'

const RecordingsSection: React.FC<RecordingsSectionProps> = ({
    recordings,
    onAdd,
    onFileChange,
    onRemove,
    shouldHighlightError,
    markFieldAsTouched,
}) => (
    <div>
        <Form.Group className="mt-4">
            <Form.Label>
                <h6>Записи экрана</h6>
            </Form.Label>
            {recordings.map((recording, index) => (
                <FileInputRow
                    key={index}
                    index={index}
                    accept="video/*"
                    file={recording}
                    onFileChange={onFileChange}
                    onRemove={onRemove}
                    shouldHighlightError={shouldHighlightError}
                    markFieldAsTouched={markFieldAsTouched}
                    fieldPrefix="otherFiles.screenRecordings"
                />
            ))}
        </Form.Group>
        <Button
            variant="outline-primary"
            onClick={onAdd}
            size="sm"
            className="mb-3"
        >
            + Добавить запись экрана
        </Button>
    </div>
);

export default RecordingsSection;
