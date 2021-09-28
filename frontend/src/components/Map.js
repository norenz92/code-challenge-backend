import React, { Component, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

const Map = ({userLocation, children}) => {

    const defaultProps = {
        center: {
          lat: 55.6129397,
          lng: 13.0107805
        },
        zoom: 11
    };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: ''}}
                defaultCenter={defaultProps.center}
                defaultZoom={11}
            >
              {children}
            </GoogleMapReact>
        </div>
    );
}

export default Map;