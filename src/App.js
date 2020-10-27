import React from 'react';
import logo from './logo.svg';
import './App.scss';
import AppRouting from './AppRouting';

class App extends React.Component {
    render() {
        return (
            <div className="main-container">
                <AppRouting />
            </div>
        )
    }
}

export default App;
