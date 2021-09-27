import Map from './components/Map';
import './App.css';
import {getMessages} from './lib/srAPI';
import { useEffect, useState } from 'react';
import {getUserLocation} from './lib/api'

const App = () => {

  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    let messages = getMessages('Kristianstad');
    
    console.log(messages)
    getLocation();
  }, [])

  const getLocation = async () => {
    let position = await getUserLocation();
    setUserLocation(position)
    console.log(position)
  }

  return (
    <div className="App">
      <Map userLocation={userLocation}>

      </Map>
    </div>
  );
}

export default App;
