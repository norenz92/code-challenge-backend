import Map from './components/Map';
import './App.css';
import {getMessages, listTrafficAreas} from './lib/srAPI';
import { useEffect, useState } from 'react';
import {getUserLocation} from './lib/api';
import MessageMarker from './components/MessageMarker';
import SideBar from './components/SideBar';
import { LocationOn } from '@material-ui/icons';

const App = () => {

  const [userLocation, setUserLocation] = useState(null)
  const [messages, setMessages] = useState([])

  const updateMessages = (area) => {
    getMessages(area).then(res => {
      setMessages(res.messages)
    })
  }

  return (
    <div className="App">
      <Map userLocation={userLocation}>
        <LocationOn
          lat={userLocation && userLocation.coords.latitude}
          lng={userLocation && userLocation.coords.longitude}
          style={{fontSize: 30, left: -10, top: 0}}
          htmlColor={'red'}
        />
        {messages.length > 0 && messages.map((message, i) => (
        <MessageMarker className="Marker" lat={message.latitude} lng={message.longitude} key={i} message={message}/>
        ))}
      </Map>
      <SideBar onUserLocationChange={(pos) => setUserLocation(pos)} onAreaChange={updateMessages}/>
    </div>
  );
}

export default App;
