import React from "react";
import { ProgressBar, Card, Button } from "react-bootstrap";
import { UploadedFilesListProps } from "../../types/LogsUploadTypes";

const UploadedFilesList: React.FC<UploadedFilesListProps> = ({
    files,
    onRemove,
}) => (
    <div className="d-flex flex-column gap-3">
        {files.map((file) => (
            <Card key={file.id} className="p-3">
                <div className="d-flex justify-content-between aligh-items-center mb-2">
                    <span
                        className="font-weight-bold text-truncate"
                        style={{ maxWidth: "70%" }}
                    >
                        {file.name}
                    </span>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onRemove(file.id)}
                    >
                        ✖
                    </Button>
                </div>
                <ProgressBar
                    now={file.progress}
                    variant={
                        file.status === "error"
                            ? "danger"
                            : file.progress === 100
                            ? "success"
                            : "primary"
                    }
                />
            </Card>
        ))}
    </div>
);

export default UploadedFilesList;