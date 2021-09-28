import React, {useEffect, useState} from 'react';
import {Select, MenuItem, TextField, FormControl, InputLabel, Button, Slider} from '@material-ui/core';
import { listTrafficAreas } from '../lib/srAPI';
import { getUserLocation, saveUserNotification, deleteSubscriber } from '../lib/api';

const SideBar = ({onUserLocationChange, onAreaChange}) => {

  const [trafficAreas, setTrafficAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState('')
  const [useUserPos, setUseUserPos] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    listTrafficAreas().then(res => {
      setTrafficAreas(res.areas)
    })
  }, [])

  const onGetPosition = async () => {
    try {
      let pos = await getUserLocation()
      console.log(pos)
      setUseUserPos(true)
      let area = await listTrafficAreas(pos.coords.latitude, pos.coords.longitude)
      console.log(area)
      setSelectedArea(area.area.name)
      onUserLocationChange(pos)
    } catch (err) {
      console.log(err)
    }
  }

  const onAreaSelect = (e) => {
    setUseUserPos(false)
    onUserLocationChange(null)
    setSelectedArea(e.target.value)
  }

  useEffect(() => {
    onAreaChange(selectedArea)
  }, [selectedArea])

  const handleSubscribe = () => {
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if ((re.test(email)) && (selectedArea !== '')) {
      saveUserNotification(email, selectedArea)
    } else {
      window.alert('Enter all details')
    }
  }

  const handleUnsubscribe = () => {
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (re.test(email)) {
      deleteSubscriber(email)
    } else {
      window.alert('Enter all details')
    }
  }

  return (
    <div className="sideBar box-shadow">
      <div className="upperContainer">
        <span className="title">Prenumerera</span>
        <span className="subtitle">Få notifikationer via epost vid händelser nära dig</span>
        <Button color="primary" variant="contained" style={{marginBottom: 10}} onClick={() => onGetPosition()}>HÄMTA POSITION</Button>
        <span>eller välj område</span>
        <FormControl fullWidth>
          <InputLabel id="areaSelectorLabel">Område</InputLabel>
          <Select
            labelId="areaSelectorLabel"
            id="areaSelector"
            value={selectedArea}
            onChange={onAreaSelect}
          >
            {trafficAreas.map((area, i) => (
              <MenuItem key={i} value={area.name}>{area.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField value={email} onChange={(e) => setEmail(e.target.value)} id="email" label="Email" variant={'filled'} style={{marginBottom: 10, marginTop: 10}}/>
        <Button color="primary" variant="contained" style={{marginBottom: 10}} onClick={() => handleSubscribe()}>ANMÄL</Button>
        <Button color="secondary" variant="contained" onClick={() => handleUnsubscribe()}>AVANMÄL ALLA</Button>
      </div>
    </div>
  )
}

export default SideBar;