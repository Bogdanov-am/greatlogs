import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import FormsPage from './pages/FormsPage';
import { useState, useEffect } from 'react';
import { TestEntry } from './types/OtherTypes';
import './App.css';

function App() {
    const [tests, setTests] = useState<TestEntry[]>(() => {
        const saved = localStorage.getItem('tests');
        return saved ? JSON.parse(saved) : [];
    });
    const navigate = useNavigate();

    // Сохраняем тесты в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('tests', JSON.stringify(tests));
    }, [tests]);

    const handleAddTest = () => navigate('/upload');
    const handleTestCreated = (newTest: TestEntry) => {
        const updatedTests = [...tests, newTest];
        setTests(updatedTests);
        console.log('Перенаправление')
        navigate('/');
    };
    const handleDeleteTest = (id: string) => {
        const updatedTests = tests.filter((test) => test.id !== id);
        setTests(updatedTests);
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
                            onDeleteTest={handleDeleteTest}
                        />
                    }
                />
                <Route
                    path="/upload"
                    element={
                        <FormsPage
                            onSubmit={handleTestCreated}
                            onCancel={() => navigate('/')}
                        />
                    }
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
