import React, { Component, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

const Map = ({userLocation, children}) => {

    const defaultProps = {
        center: {
          lat: 59.95,
          lng: 30.33
        },
        zoom: 11
    };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: ''}}
                defaultCenter={userLocation ? {lat: userLocation.coords.latitude, lon: userLocation.coords.longitude} : defaultProps.center}
                defaultZoom={11}
                center={userLocation ? {lat: userLocation.coords.latitude, lon: userLocation.coords.longitude} : defaultProps.center}
            >
              {children}
            </GoogleMapReact>
        </div>
    );
}

export default Map;