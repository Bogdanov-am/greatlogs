import React from "react";
import { Button, Form } from "react-bootstrap";
import FileInputRow from "./FileInputRow";
import { AttachmentsSectionProps } from '../../types/OtherFilesTypes'

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
    attachments,
    onAdd,
    onFileChange,
    onRemove,
    shouldHighlightError,
    markFieldAsTouched,
}) => (
    <div>
        <Form.Group className="mt-4">
            <Form.Label>
                <h6>Дополнительные вложения</h6>
            </Form.Label>
            {attachments.map((attachment, index) => (
                <FileInputRow
                    key={index}
                    index={index}
                    file={attachment}
                    onFileChange={onFileChange}
                    onRemove={onRemove}
                    shouldHighlightError={shouldHighlightError}
                    markFieldAsTouched={markFieldAsTouched}
                    fieldPrefix="otherFiles.additionalAttachments"
                />
            ))}
        </Form.Group>
        <Button
            variant="outline-primary"
            onClick={onAdd}
            size="sm"
            className="mb-3"
        >
            + Добавить вложение
        </Button>
    </div>
);

export default AttachmentsSection;
