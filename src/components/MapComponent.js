import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

function MapComponent(props) {
  const {
    mapPosition,
    mushroomIcon,
    allColors,
    allSpots,
    filteredMushrooms,
    randomMushroomImages,
    sound,
    soundMute
  } = props;

  return (
    <div className="map-container">
      <Map center={mapPosition} zoom={17}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredMushrooms.map(mushroom => (
          <Marker
            key={mushroom.name}
            position={[mushroom.latlng[0], mushroom.latlng[1]]}
            icon={mushroomIcon}
          >
            <Popup>
              <img
                className="random-img"
                src={randomMushroomImages[Math.floor(Math.random() * 10)]}
                alt="mushroom-pic"
              />
              <h3>
                Name: {mushroom.name.toUpperCase()}
                <br></br>
                Color: {allColors[mushroom.color].toUpperCase()}
                <br></br>
                Spots: {allSpots[mushroom.spots].toUpperCase()}
              </h3>
            </Popup>
          </Marker>
        ))}
      </Map>

      <div className="mute-button">
        {!sound ? (
          <FontAwesomeIcon
            onClick={() => soundMute(true)}
            icon={faVolumeUp}
            size="2x"
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <FontAwesomeIcon
            onClick={() => soundMute(false)}
            icon={faVolumeMute}
            size="2x"
            style={{ cursor: 'pointer' }}
          />
        )}
      </div>
    </div>
  );
}

export default MapComponent;
