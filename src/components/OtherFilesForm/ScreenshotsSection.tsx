import React from "react";
import { Button, Form } from "react-bootstrap";
import FileInputRow from "./FileInputRow";
import { ScreenshotsSectionProps } from "../../types/OtherFilesTypes";

const ScreenshotsSection: React.FC<ScreenshotsSectionProps> = ({
    screenshots,
    onAdd,
    onFileChange,
    onDescriptionChange,
    onRemove,
    shouldHighlightError,
    markFieldAsTouched,
}) => (
    <div>
        <Form.Group>
            <Form.Label>
                <h6>Скриншоты</h6>
            </Form.Label>
            {screenshots.map((screenshot, index) => (
                <FileInputRow
                    key={index}
                    index={index}
                    accept="image/*"
                    file={screenshot.file}
                    description={screenshot.description}
                    onFileChange={onFileChange}
                    onDescriptionChange={onDescriptionChange}
                    onRemove={onRemove}
                    shouldHighlightError={shouldHighlightError}
                    markFieldAsTouched={markFieldAsTouched}
                    fieldPrefix="otherFiles.screenshots"
                    showDescription
                />
            ))}
        </Form.Group>
        <Button
            variant="outline-primary"
            onClick={onAdd}
            size="sm"
            className="mb-3"
        >
            + Добавить скриншот
        </Button>
    </div>
);

export default ScreenshotsSection;
