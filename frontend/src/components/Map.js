import React, { Component, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

const Map = ({userLocation, children}) => {

    const defaultProps = {
        center: {
          lat: 63.3176915,
          lng: 18.1358574
        },
        zoom: 5
    };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyCpM0_5UoKdAEaLOwB4op63LnOrFLPSH58'}}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >
              {children}
            </GoogleMapReact>
        </div>
    );
}

export default Map;