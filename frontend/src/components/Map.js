import React, { Component, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Map = ({userLocation}) => {

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
                <AnyReactComponent
                lat={userLocation.coords.latitude}
                lng={userLocation.coords.longitude}
                text="My Marker"
                />
            </GoogleMapReact>
        </div>
    );
}

export default Map;