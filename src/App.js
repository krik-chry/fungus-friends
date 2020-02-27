import React, { Component } from 'react';
import L from 'leaflet';
import * as data from './api';
import MapComponent from './components/MapComponent';
import SoundPlayer from './components/SoundPlayer';
import Filters from './components/Filters';

class App extends Component {
  state = {
    mushrooms: [],
    filteredMushrooms: [],
    existingColors: [],
    existingSpots: [],
    selectedColor: 'Select color...',
    selectedSpots: 'Select spots...',
    randomMushroomImages: [],
    sound: true
  };

  async componentDidMount() {
    const mushrooms = await data.default();

    await this.setState({ mushrooms: mushrooms, filteredMushrooms: mushrooms });

    this.setState({
      existingColors: new Set(
        this.state.mushrooms.map(mushroom => data.Color[mushroom.color])
      ),
      existingSpots: new Set(
        this.state.mushrooms.map(mushroom => data.Spots[mushroom.spots])
      )
    });

    fetch('https://api.jsonbin.io/b/5e57a7e44f84932919713c5c')
      .then(response => response.json())
      .then(data => this.setState({ randomMushroomImages: data.images }));
  }

  filterMushrooms = () => {
    const { selectedColor, selectedSpots, mushrooms } = this.state;
    const { Color, Spots } = data;
    if (
      selectedColor === 'Select color...' &&
      selectedSpots !== 'Select spots...'
    ) {
      const filteredMushrooms = mushrooms.filter(
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
      const filteredMushrooms = mushrooms.filter(
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
      const filteredMushrooms = mushrooms.filter(
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
        filteredMushrooms: mushrooms,
        existingColors: new Set(
          mushrooms.map(mushroom => Color[mushroom.color])
        ),
        existingSpots: new Set(mushrooms.map(mushroom => Spots[mushroom.spots]))
      });
    }
  };

  handleColorSelection = async selectedColor => {
    await this.setState({ selectedColor });
    this.filterMushrooms();
  };

  handleSpotsSelection = async selectedSpots => {
    await this.setState({ selectedSpots });
    this.filterMushrooms();
  };

  onClear = async selectbox => {
    const { mushrooms } = this.state;
    if (selectbox === 'color') {
      await this.setState({
        filteredMushrooms: mushrooms,
        selectedColor: 'Select color...'
      });
      this.filterMushrooms();
    }
    if (selectbox === 'spots') {
      await this.setState({
        filteredMushrooms: mushrooms,
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
    const position = ['52.081153', '5.236057'];
    const mushroomIcon = new L.Icon({
      iconUrl: require('./images/mushroom.svg'),
      iconSize: [50, 50]
    });

    // Define select options and make it into array
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
          colorOptions={colorOptions}
          spotsOptions={spotsOptions}
          mushrooms={this.state.mushrooms}
          filteredMushrooms={this.state.filteredMushrooms}
          selectedColor={this.state.selectedColor}
          selectedSpots={this.state.selectedSpots}
          handleColorSelection={this.handleColorSelection}
          handleSpotsSelection={this.handleSpotsSelection}
          onClear={this.onClear}
        />
        <MapComponent
          mapPosition={position}
          mushroomIcon={mushroomIcon}
          allColors={Color}
          allSpots={Spots}
          filteredMushrooms={this.state.filteredMushrooms}
          sound={this.state.sound}
          soundMute={this.soundMute}
          randomMushroomImages={this.state.randomMushroomImages}
        />
        <SoundPlayer sound={this.state.sound} />
      </>
    );
  }
}

export default App;
