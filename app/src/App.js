import { Outlet } from 'react-router-dom';
import './App.css';
function App() {

  return (
    <div className="App">
      <div className="App__innerContainer">
        {/*Content of the page. Depends on the link*/}
        <div className="App__contentContainer">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;