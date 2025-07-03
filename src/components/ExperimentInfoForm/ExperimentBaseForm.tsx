import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import {
    ExperimentBaseFormProps,
    SelectItem,
} from '../../types/ExperimentInfoTypes';
import ExperimentOperators from './ExperimentOperators';
import ResponsibleOperator from './ResponsibleOperator';
import RecordCreator from './CreatorSelect';
import LocationSelect from './LocationSelect';

const ExperimentBaseForm: React.FC<ExperimentBaseFormProps> = ({
    data,
    onChange,
    shouldHighlightError,
    markFieldAsTouched,
    touchedFields,
}) => {
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        onChange({ ...data, [name]: checked });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...data,
            reportFile: e.target.files?.[0] || null,
        });
    };

    const handleLocationChange = (location: SelectItem | null) => {
        onChange({
            ...data,
            locations: location?.label || '',
            selectedLocation: location,
        });
    };

    const handleOperatorsChange = (operators: SelectItem[]) => {
        const newOperators = operators.map((op) => ({
            id: op.id,
            fullName: op.label,
            isResponsible: false,
            label: op.label,
        }));

        // Проверяем, есть ли текущий ответственный оператор в новом списке
        const currentResponsible = data.responsibleOperator;
        const responsibleStillValid = data.responsibleOperator
            ? newOperators.some((op) => op.id === data.responsibleOperator?.id)
            : false;

        // Проверяем, есть ли текущий составитель записи в новом списке
        const currentCreator = data.recordCreator;
        const creatorStillValid = data.recordCreator
            ? newOperators.some((op) => op.id === data.recordCreator?.id)
            : false;

        onChange({
            ...data,
            operators: newOperators,
            responsibleOperator: responsibleStillValid
                ? currentResponsible
                : // ? data.responsibleOperator
                  null,
            recordCreator: creatorStillValid ? currentCreator : null,
            // recordCreator: creatorStillValid ? data.recordCreator : null,
        });
    };

    const handleResponsibleChange = (
        responsibleOperator: SelectItem | null
    ) => {
        onChange({ ...data, responsibleOperator });
    };

    const handleCreatorChange = (recordCreator: SelectItem | null) => {
        onChange({ ...data, recordCreator });
    };

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>
                    <h5
                        style={{
                            color: shouldHighlightError(
                                'experiment.experimentDate',
                                data.experimentDate
                            )
                                ? 'red'
                                : '',
                        }}
                    >
                        Дата испытания
                    </h5>
                </Form.Label>
                <Form.Control
                    type="date"
                    name="experimentDate"
                    value={data.experimentDate}
                    onChange={handleInputChange}
                    onBlur={() =>
                        markFieldAsTouched('experiment.experimentDate')
                    }
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>
                    <h5
                        style={{
                            color: shouldHighlightError(
                                'experiment.description',
                                data.description
                            )
                                ? 'red'
                                : '',
                        }}
                    >
                        Описание испытания
                    </h5>
                </Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={data.description}
                    onChange={handleInputChange}
                    onBlur={() => markFieldAsTouched('experiment.description')}
                    placeholder="Опишите испытание"
                    required
                />
            </Form.Group>

            <LocationSelect
                locations={data.availableLocations || []}
                selectedLocation={
                    data.availableLocations.find(
                        (loc) => loc.label === data.locations
                    ) || null
                }
                onLocationChange={handleLocationChange}
                loading={data.loadingLocations || false}
                error={shouldHighlightError(
                    'experiment.selectedLocation',
                    data.selectedLocation
                )}
                onBlur={() => markFieldAsTouched('experiment.selectedLocation')}
            />

            <Row className="mt-3 align-items-stretch">
                <Col className="d-flex flex-column">
                    <ExperimentOperators
                        operators={data.availableOperators || []}
                        selectedOperators={data.operators || []}
                        onOperatorsChange={handleOperatorsChange}
                        loading={data.loadingOperators || false}
                        required={true}
                        initialTouched={touchedFields['experiment.operators']}
                        onBlur={() =>
                            markFieldAsTouched('experiment.operators')
                        }
                    />
                </Col>

                <Col className="d-flex flex-column">
                    <ResponsibleOperator
                        operators={data.operators || []}
                        selectedOperator={data.responsibleOperator || null}
                        onOperatorChange={handleResponsibleChange}
                        loading={data.loadingOperators || false}
                        error={shouldHighlightError(
                            'experiment.responsibleOperator',
                            data.responsibleOperator
                        )}
                        onBlur={() =>
                            markFieldAsTouched('experiment.responsibleOperator')
                        }
                    />
                </Col>

                <Col className="d-flex flex-column">
                    <RecordCreator
                        operators={data.operators || []}
                        selectedCreator={data.recordCreator || null}
                        onCreatorChange={handleCreatorChange}
                        loading={data.loadingOperators || false}
                        error={shouldHighlightError(
                            'experiment.recordCreator',
                            data.recordCreator
                        )}
                        onBlur={() =>
                            markFieldAsTouched('experiment.recordCreator')
                        }
                    />
                </Col>
            </Row>

            <Form.Group className="mt-3">
                <Form.Label>
                    <h5
                        style={{
                            color: shouldHighlightError(
                                'experiment.reportFile',
                                data.reportFile
                            )
                                ? 'red'
                                : '',
                        }}
                    >
                        Отчет
                    </h5>
                </Form.Label>
                <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    onBlur={() => markFieldAsTouched('experiment.reportFile')}
                    required
                />
                {data.reportFile && (
                    <div className="mt-1 small text-muted">
                        Выбран файл: {data.reportFile.name}
                    </div>
                )}
            </Form.Group>

            <Form.Group className="mb-3 mt-4">
                <Form.Check
                    type="checkbox"
                    label={<h5>Наличие событий</h5>}
                    name="hasEvents"
                    checked={data.hasEvents}
                    onChange={handleCheckboxChange}
                />
            </Form.Group>
        </>
    );
};

export default ExperimentBaseForm;
