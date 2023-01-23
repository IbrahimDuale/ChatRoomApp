import { Outlet } from 'react-router-dom';
import './App.css';
function App() {
  return (
    <div className="app">
      {/*Content of the page. Depends on the link*/}
      <div className="app__contentContainer">
        <Outlet />
      </div>
    </div>
  );
}

export default App;