import React, {useEffect, useState} from 'react';
import {Select, MenuItem, TextField, FormControl, InputLabel, Button, Slider} from '@material-ui/core';
import {LocationSearching} from '@mui/icons-material'
import { listTrafficAreas } from '../lib/srAPI';
import { getUserLocation, addSubscriber, deleteSubscriber } from '../lib/api';

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
      window.alert('Kunde inte hämta position')
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
    if (selectedArea !== '') {
      addSubscriber(email, selectedArea).then((res) => {
        console.log(res)
        window.alert('Epost registrerad!')
      }).catch(err => {
        console.log(err)
        window.alert(err.data.message)
      });
    } else {
      window.alert('Ange område')
    }
  }

  const handleUnsubscribe = () => {
    deleteSubscriber(email).then((res) => {
      window.alert(res.data.message)
      setEmail('')
    }).catch((err) => {
      window.alert(err.message)
    })
  }

  return (
    <div className="sideBar box-shadow">
      <div className="upperContainer">
        <span className="title">Prenumerera</span>
        <span className="subtitle">Få notifikationer via epost vid händelser nära dig</span>
        <Button color="info" variant="contained" style={{marginBottom: 10}} onClick={() => onGetPosition()} startIcon={<LocationSearching />}>HÄMTA POSITION</Button>
        <span className="pickAreaText">eller välj område</span>
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
        <Button color="secondary" variant="contained" onClick={() => handleUnsubscribe()}>AVANMÄL</Button>
      </div>
    </div>
  )
}

export default SideBar;