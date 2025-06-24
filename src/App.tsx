import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FormsPage from './pages/FormsPage';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomePage
                                onAddTestClick={() =>
                                    (window.location.href = 'upload')
                                }
                            />
                        }
                    />
                    <Route path="/upload" element={<FormsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
