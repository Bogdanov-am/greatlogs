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
    Image,
    Col,
    Row,
} from 'react-bootstrap';
import { ExperimentDetails } from '../types/PagesTypes';

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

    const downloadFile = async (path: string) => {
        try {
            // Нормализуем путь (заменяем все обратные слеши на прямые)
            const normalizedPath = path.replace(/\\/g, '/');

            // Отправляем запрос на сервер
            const response = await fetch(
                `http://10.200.10.219:5000/api/download?path=${encodeURIComponent(
                    normalizedPath
                )}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to download file');
            }

            // Получаем blob и создаем ссылку для скачивания
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = normalizedPath.split('/').pop() || 'download';
            document.body.appendChild(link);
            link.click();

            // Очистка
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (err: unknown) {
            console.error('Download error:', err);
            alert(`Ошибка при загрузке файла: ${(err as Error).message}`);
        }
    };



    const getFileUrl = (path: string) => {
        return `http://10.200.10.219:5000/api/download?path=${encodeURIComponent(
            path
        )}`;
    };

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
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (
                                                            experiment.report_file
                                                        ) {
                                                            downloadFile(
                                                                experiment.report_file
                                                            );
                                                        }
                                                    }}
                                                    className="btn btn-primary btn-sm"
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
                                                                    href="#"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        downloadFile(
                                                                            video
                                                                        );
                                                                    }}
                                                                    className="btn btn-primary btn-sm"
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
                                                                    href="#"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        downloadFile(
                                                                            file
                                                                        );
                                                                    }}
                                                                    className="btn btn-primary btn-sm"
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

                {/* События */}
                <Tab
                    eventKey="events"
                    title="События"
                    disabled={experiment.events.length === 0}
                >
                    <Card className="mt-3">
                        <Card.Body>
                            {experiment.events.length > 0 ? (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Время</th>
                                            <th>Описание</th>
                                            <th>Аппараты</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {experiment.events.map(
                                            (event, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {event.time ||
                                                            'Не указано'}
                                                    </td>
                                                    <td>{event.description}</td>
                                                    <td>
                                                        {event.devices.length >
                                                        0
                                                            ? event.devices.join(
                                                                  ', '
                                                              )
                                                            : 'Не указаны'}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </Table>
                            ) : (
                                <Alert variant="info">
                                    Событий не зарегистрировано
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                {/* Файлы */}
                <Tab eventKey="files" title="Файлы">
                    <Card className="mt-3">
                        <Card.Body>
                            <Tabs
                                defaultActiveKey="screenshots"
                                className="mb-3"
                            >
                                {/* Скриншоты */}
                                <Tab
                                    eventKey="screenshots"
                                    title="Скриншоты"
                                    disabled={
                                        experiment.screenshots.length === 0
                                    }
                                >
                                    {experiment.screenshots.length > 0 ? (
                                        <Row>
                                            {experiment.screenshots.map(
                                                (screenshot, index) => (
                                                    <Col
                                                        md={4}
                                                        key={index}
                                                        className="mb-3"
                                                    >
                                                        <Card>
                                                            <a
                                                                href={getFileUrl(
                                                                    screenshot.path
                                                                )}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Image
                                                                    src={getFileUrl(
                                                                        screenshot.path
                                                                    )}
                                                                    thumbnail
                                                                />
                                                            </a>
                                                            <Card.Body>
                                                                <Card.Text>
                                                                    {screenshot.description ||
                                                                        'Без описания'}
                                                                </Card.Text>
                                                                <a
                                                                    href="#"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        downloadFile(
                                                                            screenshot.path
                                                                        );
                                                                    }}
                                                                    className="btn btn-primary btn-sm"
                                                                >
                                                                    Скачать
                                                                </a>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                )
                                            )}
                                        </Row>
                                    ) : (
                                        <Alert variant="info">
                                            Скриншотов нет
                                        </Alert>
                                    )}
                                </Tab>

                                {/* Записи экрана */}
                                <Tab
                                    eventKey="recordings"
                                    title="Записи экрана"
                                    disabled={
                                        experiment.screen_recordings.length ===
                                        0
                                    }
                                >
                                    {experiment.screen_recordings.length > 0 ? (
                                        <ListGroup>
                                            {experiment.screen_recordings.map(
                                                (recording, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span>
                                                                Запись экрана{' '}
                                                                {index + 1}
                                                            </span>
                                                            <a
                                                                href="#"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    downloadFile(
                                                                        recording
                                                                    );
                                                                }}
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                Скачать
                                                            </a>
                                                        </div>
                                                    </ListGroup.Item>
                                                )
                                            )}
                                        </ListGroup>
                                    ) : (
                                        <Alert variant="info">
                                            Записей экрана нет
                                        </Alert>
                                    )}
                                </Tab>

                                {/* Логи */}
                                <Tab
                                    eventKey="logs"
                                    title="Логи"
                                    disabled={experiment.logs.length === 0}
                                >
                                    {experiment.logs.length > 0 ? (
                                        <ListGroup>
                                            {experiment.logs.map(
                                                (log, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span>
                                                                Лог {index + 1}
                                                            </span>
                                                            <a
                                                                href="#"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    downloadFile(
                                                                        log.path
                                                                    );
                                                                }}
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                Скачать
                                                            </a>
                                                        </div>
                                                    </ListGroup.Item>
                                                )
                                            )}
                                        </ListGroup>
                                    ) : (
                                        <Alert variant="info">Логов нет</Alert>
                                    )}
                                </Tab>

                                {/* Вложения */}
                                <Tab
                                    eventKey="attachments"
                                    title="Прочие файлы"
                                    disabled={
                                        experiment.attachments.length === 0
                                    }
                                >
                                    {experiment.attachments.length > 0 ? (
                                        <ListGroup>
                                            {experiment.attachments.map(
                                                (attachment, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span>
                                                                Файл {index + 1}
                                                            </span>
                                                            <a
                                                                href="#"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    downloadFile(
                                                                        attachment
                                                                    );
                                                                }}
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                Скачать
                                                            </a>
                                                        </div>
                                                    </ListGroup.Item>
                                                )
                                            )}
                                        </ListGroup>
                                    ) : (
                                        <Alert variant="info">
                                            Дополнительных файлов нет
                                        </Alert>
                                    )}
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default ExperimentViewPage;
