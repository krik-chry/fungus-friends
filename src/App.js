import React, { Component } from 'react';
import L from 'leaflet';
import * as data from './api';
import MapComponent from './components/MapComponent';
import SoundPlayer from './components/SoundPlayer';
import Filters from './components/Filters';

class App extends Component {
  state = {
    allMushrooms: [],
    filteredMushrooms: [],
    existingColors: [],
    existingSpots: [],
    selectedColor: 'Select color...',
    selectedSpots: 'Select spots...',
    randomMushroomImages: [],
    sound: true
  };

  async componentDidMount() {
    // Get data from provided api and add them to local state
    // Initially both all mushrooms array and filtered mushrooms are the given data from the api.ts
    const mushrooms = await data.default();
    await this.setState({
      allMushrooms: mushrooms,
      filteredMushrooms: mushrooms
    });

    // Check Mushrooms properties and get the possible options for color and spots
    this.setState({
      existingColors: new Set(
        this.state.allMushrooms.map(mushroom => data.Color[mushroom.color])
      ),
      existingSpots: new Set(
        this.state.allMushrooms.map(mushroom => data.Spots[mushroom.spots])
      )
    });

    // Get random mushroom images
    fetch('https://api.jsonbin.io/b/5e57a7e44f84932919713c5c')
      .then(response => response.json())
      .then(data => this.setState({ randomMushroomImages: data.images }));
  }

  filterMushrooms = () => {
    const { selectedColor, selectedSpots, allMushrooms } = this.state;
    const { Color, Spots } = data;

    // This is the most confusing part, sorry :(
    // 4 cases:
    // - Color selectbox empty --> Filter by Spots
    // - Spots selectbox empty --> Filter by Color
    // - Both selected --> Filter by both properties
    // - None selected --> Reset mushrooms to original array
    if (
      selectedColor === 'Select color...' &&
      selectedSpots !== 'Select spots...'
    ) {
      const filteredMushrooms = allMushrooms.filter(
        mushroom => mushroom.spots === Spots[selectedSpots.value]
      );
      this.setState({
        filteredMushrooms: filteredMushrooms,
        existingColors: new Set(
          filteredMushrooms.map(mushroom => Color[mushroom.color])
        )
      });
    } else if (
      selectedSpots === 'Select spots...' &&
      selectedColor !== 'Select color...'
    ) {
      const filteredMushrooms = allMushrooms.filter(
        mushroom => mushroom.color === Color[selectedColor.value]
      );
      this.setState({
        filteredMushrooms: filteredMushrooms,
        existingSpots: new Set(
          filteredMushrooms.map(mushroom => Spots[mushroom.spots])
        )
      });
    } else if (
      selectedColor !== 'Select color...' &&
      selectedSpots !== 'Select spots...'
    ) {
      const filteredMushrooms = allMushrooms.filter(
        mushroom =>
          mushroom.spots === Spots[selectedSpots.value] &&
          mushroom.color === Color[selectedColor.value]
      );
      this.setState({
        filteredMushrooms: filteredMushrooms,
        existingColors: new Set(
          filteredMushrooms.map(mushroom => Color[mushroom.color])
        ),
        existingSpots: new Set(
          filteredMushrooms.map(mushroom => Spots[mushroom.spots])
        )
      });
    } else {
      this.setState({
        filteredMushrooms: allMushrooms,
        existingColors: new Set(
          allMushrooms.map(mushroom => Color[mushroom.color])
        ),
        existingSpots: new Set(
          allMushrooms.map(mushroom => Spots[mushroom.spots])
        )
      });
    }
  };

  // Selecting a color or spots triggers the filter function
  handleColorSelection = async selectedColor => {
    await this.setState({ selectedColor });
    this.filterMushrooms();
  };

  handleSpotsSelection = async selectedSpots => {
    await this.setState({ selectedSpots });
    this.filterMushrooms();
  };

  // On clearing a selectbox,reset form and re-filter the original array with the new selections/no selections
  onClear = async selectbox => {
    const { allMushrooms } = this.state;
    if (selectbox === 'color') {
      await this.setState({
        filteredMushrooms: allMushrooms,
        selectedColor: 'Select color...'
      });
      this.filterMushrooms();
    }
    if (selectbox === 'spots') {
      await this.setState({
        filteredMushrooms: allMushrooms,
        selectedSpots: 'Select spots...'
      });
      this.filterMushrooms();
    }
  };

  soundMute = value => {
    this.setState({
      sound: value
    });
  };

  render() {
    // Define map and marker properties
    const position = ['52.081153', '5.236057'];
    const mushroomIcon = new L.Icon({
      iconUrl: require('./images/mushroom.svg'),
      iconSize: [50, 50]
    });

    // Define select options from api enums
    // There must be an easier way than Set/Array.from but I am not so familiar with TS
    const { Color, Spots } = data;
    const { existingColors, existingSpots } = this.state;

    const colorOptions = Array.from(existingColors).map(color => ({
      value: color,
      label: color.charAt(0).toUpperCase() + color.slice(1).toLowerCase()
    }));
    const spotsOptions = Array.from(existingSpots).map(spot => ({
      value: spot,
      label: spot.charAt(0).toUpperCase() + spot.slice(1).toLowerCase()
    }));
    return (
      <>
        <Filters
          state={this.state}
          handleColorSelection={this.handleColorSelection}
          handleSpotsSelection={this.handleSpotsSelection}
          onClear={this.onClear}
          colorOptions={colorOptions}
          spotsOptions={spotsOptions}
        />
        <MapComponent
          state={this.state}
          mapPosition={position}
          mushroomIcon={mushroomIcon}
          allColors={Color}
          allSpots={Spots}
        />
        <SoundPlayer sound={this.state.sound} />
      </>
    );
  }
}

export default App;
