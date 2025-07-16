import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import FormsPage from './pages/FormsPage';
import ExperimentViewPage from './pages/ExperimentViewPage';
import { useState, useEffect } from 'react';
import { TestEntry } from './types/PagesTypes';
import './App.css';

const API_BASE_URL = 'http://10.200.10.219:5000';

function App() {
    const [tests, setTests] = useState<TestEntry[]>(() => {
        const saved = localStorage.getItem('tests');
        return saved ? JSON.parse(saved) : [];
    });
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('tests', JSON.stringify(tests));
    }, [tests]);

    const handleAddTest = () => navigate('/upload');

    const handleTestCreated = (newTest: TestEntry) => {
        const updatedTests = [...tests, newTest];
        setTests(updatedTests);
        console.log('Перенаправление');
        navigate('/');
    };

    const handleDeleteExperiment = async (id: string) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/experiments/${id}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || 'Ошибка при удалении эксперимента'
                );
            }

            const updatedTests = tests.filter((test) => test.id !== id);
            setTests(updatedTests);
        } catch (err) {
            console.error('Ошибка при удалении эксперимента:', err);
            alert(
                err instanceof Error
                    ? err.message
                    : 'Неизвестная ошибка при удалении эксперимента'
            );
        }
    };

    return (
        <div className="App">
            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            tests={tests}
                            onAddTestClick={handleAddTest}
                            onDeleteExperiment={handleDeleteExperiment}
                        />
                    }
                />
                <Route
                    path="/upload"
                    element={
                        <FormsPage
                            onSubmit={handleTestCreated}
                            onCancel={() => navigate('/')}
                            onDeleteExperiment={handleDeleteExperiment} // Передаем функцию удаления
                        />
                    }
                />
                <Route
                    path="/experiment/:id"
                    element={<ExperimentViewPage />}
                />
            </Routes>
        </div>
    );
}

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}
