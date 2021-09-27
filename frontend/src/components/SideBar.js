import React, {useEffect, useState} from 'react';
import {Select, MenuItem, TextField} from '@material-ui/core';
import { listTrafficAreas } from '../lib/srAPI';

const SideBar = () => {

  const [trafficAreas, setTrafficAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState(null)

  useEffect(() => {
    listTrafficAreas().then(res => {
      setTrafficAreas(res.areas)
    })
  }, [])

  return (
    <div className="sideBar box-shadow">
      <span className="title">Prenumerera</span>
      <Select
          id="areaSelector"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          {trafficAreas.map((area, i) => (
            <MenuItem key={i} value={area.name}>{area.name}</MenuItem>
          ))}
        </Select>
        <TextField id="email" label="Email"/>
    </div>
  )
}

export default SideBar;