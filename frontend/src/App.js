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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMessages().then(messages => {
      console.log(messages)
      setMessages(messages.messages)
      setLoading(false)
    });
    listTrafficAreas().then(areas => {
      console.log(areas)
    })
    getLocation();
  }, [])


  const getLocation = async () => {
    let position = await getUserLocation();
    setUserLocation(position)
    console.log(position)
  }

  return (
    <div className="App">
      {!loading &&
      <Map userLocation={userLocation}>
        <LocationOn
          lat={userLocation && userLocation.coords.latitude}
          lng={userLocation && userLocation.coords.longitude}
          htmlColor={'red'}
        />
        {messages.map((message, i) => (
        <MessageMarker className="Marker" lat={message.latitude} lng={message.longitude} key={i} message={message}/>
        ))}
      </Map>
      }
      <SideBar/>
    </div>
  );
}

export default App;
