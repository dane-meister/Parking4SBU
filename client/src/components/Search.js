// AutocompleteSearch.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import '../stylesheets/Search.css'; // Import CSS file for custom styling
const HOST = "http://localhost:8000"

const AutocompleteSearch = (props) => {
  const { 
    value, setValue, 
    searchType, 
    buildings, 
    parkingLots, 
    selectedBuilding, setSelectedBuilding, 
    setLotResults, 
    setBaseLots, 
    setSelectedLot,
    setSort
  } = props


  const [ suggestions, setSuggestions ] = useState([]);

  // Extract building names from the buildings array
  const building_names = buildings.map(bldg => bldg.building_name);

  // Extract lot names from parkingLots array, filtering only lots with capacity > 0
  const lot_names = parkingLots
    .filter(lot => lot.capacity > 0)
    .map(lot => lot.name);

     // Function that performs the search logic
  const performSearch = async () => {
    if (!value.trim()) {
      setSelectedBuilding(null);
      return;
    }
    if (searchType === "building") {
      if (building_names.includes(value)) {
        const bldg = buildings.filter(bldg => bldg.building_name === value)[0];
        setSelectedBuilding(bldg);
        try {
          const response = await axios.get(`http://localhost:8000/api/wayfinding/${bldg.id}`, {
            withCredentials: true
          });
          setBaseLots(response.data);
          setLotResults(response.data);
        } catch (err) {
          console.error("Error fetching lot results:", err);
          alert("Error fetching lot results");
        }
      } else {
        alert("INVALID bldg");
      }
    } else { // For parking lot search
      if (lot_names.includes(value)) {
        const lot = parkingLots.filter(lot => lot.name === value)[0];
        setSelectedLot(lot);
      } else {
        alert("INVALID lot");
      }
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await performSearch();
    }
  };

  useEffect(() => {
    if (value && value.trim() !== "") {
      performSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Function to get suggestions based on user input
  const getSuggestions = (inputValue) => {
    // Escape special characters in the input string
    const escapeRegex = (str) => str.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    // Split input into words and escape each word
    const words = inputValue.trim().split(/\s+/).map(escapeRegex);
    // Create regex for each word
    const regexes = words.map(word => new RegExp(word, 'i'));

    let suggestions;
    if (searchType === 'building') {
      // Filter building names based on regex match
      // suggestions = building_names.filter(building =>
      //   regexes.every(regex => regex.test(building))
      // );
      return buildings.filter(bldg =>
        regexes.every(regex => regex.test(bldg.building_name))
      );
    } else { // For parking lots
      // Filter lot names based on regex match
      suggestions = lot_names.filter(lot =>
        regexes.every(regex => regex.test(lot))
      );
    }

    const MAX_RETURN = 5; // Limit the number of suggestions returned
    if (suggestions.length === 0) {
      return ['No results found']; // Return a default message if no matches
    }
    return suggestions.slice(0, MAX_RETURN);
  };

  // Fetch suggestions when the input value changes
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  // Clear suggestions when needed
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Update the input value when it changes
  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const getSuggestionValue = (suggestion) => {
    if (searchType === 'building') {
      return suggestion.building_name;
    }
    return suggestion === "No results found" ? "" : suggestion;
  };


  const renderSuggestion = (suggestion) => {
    if (searchType === 'building') {
      return <div>{suggestion.building_name}</div>;
    }
    return <div>{suggestion}</div>;
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission behavior

      if (searchType === 'building') {
        // Handle building search
        if (building_names.includes(value)) {
          const bldg = buildings.filter(bldg => bldg.building_name === value)[0];
          setSelectedBuilding(bldg);
          try {
            // Fetch lot results for the selected building
            const response = await axios.get(`${HOST}/api/wayfinding/${bldg.id}`, {
              withCredentials: true
            });            
            setBaseLots(response.data);
            setLotResults(response.data);
            setSort(); // sorts by distance
          } catch (err) {
            console.error("Error fetching lot results:", err);
            alert('Error fetching lot results');
          }
        } else {
          alert('INVALID bldg'); // Alert if the building is invalid
        }
      } else { // Handle parking lot search
        if (lot_names.includes(value)) {
          const lot = parkingLots.filter(lot => lot.name === value)[0];
          setSelectedLot(lot);
        } else {
          alert('INVALID lot'); // Alert if the lot is invalid
        }
      }
    }
  };

  // Input properties for the Autosuggest component
  const inputProps = {
    placeholder: `Search for a ${searchType}`, // Dynamic placeholder based on search type
    value,
    id: 'search-input',
    onChange,
    onKeyDown: handleKeyDown
  };

  // Custom theme for styling the Autosuggest component
  const theme = {
    container: 'autocomplete-container',
    suggestionsContainer: 'suggestions-container',
    suggestion: 'suggestion',
    suggestionHighlighted: 'suggestion-highlighted',
    input: 'autocomplete-input'
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      theme={theme} // Apply custom theme for styling
    />
  );
};

export default AutocompleteSearch;
