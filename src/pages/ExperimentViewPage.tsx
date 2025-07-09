import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Button,
    Card,
    ListGroup,
    Spinner,
    Alert,
    Tab,
    Tabs,
    Table,
    Badge,
} from 'react-bootstrap';
import { ExperimentDetails } from '../types/PagesTypes'; // Создайте этот тип

const ExperimentViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [experiment, setExperiment] = useState<ExperimentDetails | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExperiment = async () => {
            try {
                const response = await fetch(
                    `http://10.200.10.219:5000/api/all-experiment-data/${id}`
                );
                if (!response.ok) throw new Error('Ошибка загрузки данных');
                const data = await response.json();
                setExperiment(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Неизвестная ошибка'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchExperiment();
    }, [id]);

    if (loading)
        return (
            <Container className="d-flex justify-content-center mt-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        );

    if (error)
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    {error}
                    <Button
                        variant="outline-danger"
                        onClick={() => navigate(-1)}
                        className="ms-3"
                    >
                        Назад
                    </Button>
                </Alert>
            </Container>
        );

    if (!experiment)
        return (
            <Container className="mt-4">
                <Alert variant="warning">
                    Эксперимент не найден
                    <Button
                        variant="outline-warning"
                        onClick={() => navigate('/')}
                        className="ms-3"
                    >
                        На главную
                    </Button>
                </Alert>
            </Container>
        );

    const downloadFile = (path: string) => {
        return `http://10.200.10.219:5000/api/download?path=${encodeURIComponent(
            path
        )}`;
    };

    return (
        <Container className="my-4" style={{ maxWidth: '900px' }}>
            <Button
                variant="outline-secondary"
                onClick={() => navigate(-1)}
                className="mb-3"
            >
                ← Назад к списку
            </Button>

            <h2 className="mb-4">Детали эксперимента #{experiment.id}</h2>

            <Tabs defaultActiveKey="general" className="mb-3">
                {/* Основная информация */}
                <Tab eventKey="general" title="Основная информация">
                    <Card className="mt-3">
                        <Card.Body>
                            <Table striped bordered>
                                <tbody>
                                    <tr>
                                        <td>
                                            <strong>Дата создания</strong>
                                        </td>
                                        <td>{experiment.created_date}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Описание</strong>
                                        </td>
                                        <td>{experiment.description}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Локация</strong>
                                        </td>
                                        <td>
                                            {experiment.location ||
                                                'Не указана'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Операторы</strong>
                                        </td>
                                        <td>
                                            {experiment.operators.length > 0
                                                ? experiment.operators.join(
                                                      ', '
                                                  )
                                                : 'Нет других операторов'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>
                                                Ответственный оператор
                                            </strong>
                                        </td>
                                        <td>
                                            {experiment.responsible_operator}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>
                                                Оператор, создавший запись
                                            </strong>
                                        </td>
                                        <td>{experiment.creator_operator}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Отчёт</strong>
                                        </td>
                                        <td>
                                            {experiment.report_file ? (
                                                <a
                                                    href={downloadFile(
                                                        experiment.report_file
                                                    )}
                                                    download
                                                >
                                                    Скачать отчёт
                                                </a>
                                            ) : (
                                                'Отчёт отсутствует'
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                {/* Аппараты */}
                <Tab eventKey="devices" title="Аппараты">
                    <Card className="mt-3">
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Тип устройства</th>
                                        <th>Mavlink ID</th>
                                        <th>Бортовое видео</th>
                                        <th>Параметры</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {experiment.devices.map((device, index) => (
                                        <tr key={index}>
                                            <td>{device.type}</td>
                                            <td>{device.mavlink_id}</td>
                                            <td>
                                                {device.onboard_video.length >
                                                0 ? (
                                                    <div className="d-flex flex-column gap-1">
                                                        {device.onboard_video.map(
                                                            (video, i) => (
                                                                <a
                                                                    key={`video-${i}`}
                                                                    href={downloadFile(
                                                                        video
                                                                    )}
                                                                    download
                                                                >
                                                                    Видео{' '}
                                                                    {i + 1}
                                                                </a>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">
                                                        Нет видео
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {device.parameters_files
                                                    .length > 0 ? (
                                                    <div className="d-flex flex-column gap-1">
                                                        {device.parameters_files.map(
                                                            (file, i) => (
                                                                <a
                                                                    key={`param-${i}`}
                                                                    href={downloadFile(
                                                                        file
                                                                    )}
                                                                    download
                                                                >
                                                                    Параметры{' '}
                                                                    {i + 1}
                                                                </a>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">
                                                        Нет файлов
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                {/* Остальные вкладки... */}
                {/* Добавьте вкладки для Events, Logs, Screenshots и т.д. по аналогии */}
                
            </Tabs>
        </Container>
    );
};

export default ExperimentViewPage;