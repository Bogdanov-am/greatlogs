import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FileInputRowProps } from "../../types/OtherFilesTypes";

const FileInputRow: React.FC<FileInputRowProps> = ({
    index,
    accept,
    file,
    description,
    onFileChange,
    onDescriptionChange,
    onRemove,
    shouldHighlightError,
    markFieldAsTouched,
    fieldPrefix,
    showDescription = false,
}) => {
    const getFieldName = (field?: string) => {
        return field
            ? `${fieldPrefix}[${index}].${field}`
            : `${fieldPrefix}[${index}]`;
    };

    const handleBlur = (field?: string) => {
        markFieldAsTouched(getFieldName(field));
    };

    return (
        <Row className="mb-3 align-items-start">
            <Col md={showDescription ? 5 : 10} className="d-flex flex-column">
                <Form.Control
                    type="file"
                    accept={accept}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onFileChange(index, e.target.files?.[0] || null);
                        handleBlur(showDescription ? "file" : undefined);
                    }}
                    onBlur={() =>
                        handleBlur(showDescription ? "file" : undefined)
                    }
                    style={{
                        border: shouldHighlightError(
                            getFieldName(showDescription ? "file" : undefined),
                            file
                        )
                            ? "1px solid red"
                            : "",
                    }}
                    required
                    className="flex-grow-0"
                />
                {file && (
                    <div 
                        className="small text-muted mt-1 text-start"
                    >
                        Выбран файл: {file.name}
                    </div>
                )}
            </Col>

            {showDescription && (
                <Col md={5}>
                    <Form.Control
                        type="text"
                        placeholder="Описание"
                        value={description || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onDescriptionChange?.(index, e.target.value);
                            handleBlur("description");
                        }}
                        onBlur={() => handleBlur("description")}
                        style={{
                            border: shouldHighlightError(
                                getFieldName("description"),
                                description
                            )
                                ? "1px solid red"
                                : "",
                        }}
                        required
                    />
                </Col>
            )}

            <Col md={2} className="d-flex align-items-center">
                <Button
                    variant="outline-danger"
                    onClick={() => onRemove(index)}
                    style={{ height: "38px" }}
                >
                    Удалить
                </Button>
            </Col>
        </Row>
    );
};

export default FileInputRow;