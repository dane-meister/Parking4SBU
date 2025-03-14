// AutocompleteSearch.js
import React, { useState } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import '../stylesheets/Search.css'; // Import CSS file for custom styling

const AutocompleteSearch = ({ value, setValue, searchType, buildings, parkingLots, setSelectedBuilding, selectedBuilding, setLotResults }) => {
  const [ suggestions, setSuggestions ] = useState([]);
  // Mock data for suggestions
  const building_names = buildings.map(bldg => bldg.building_name);

  const getSuggestions = (inputValue) => {
    const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape special characters
  
    const words = inputValue.trim().split(/\s+/).map(escapeRegex); // Escape each word
    const regexes = words.map(word => new RegExp(word, 'i')); // Create regex for each word
    
    const suggestions = building_names.filter(building =>
      regexes.every(regex => regex.test(building)) // Check if all words appear somewhere
    );
  
    const MAX_RETURN = 5;
    if (suggestions.length === 0) {
      return ['No results found'];
    }
    return suggestions.slice(0, MAX_RETURN);
  };
    
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const getSuggestionValue = (suggestion) => {
    return suggestion === "No results found" ? "" : suggestion;
  };
  
  const renderSuggestion = (suggestion) => {
    return <div>{suggestion}</div>;
  }

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission behavior
      if(building_names.includes(value)){
        const bldg = buildings.filter(bldg => bldg.building_name===value)[0];
        setSelectedBuilding(bldg);
        try{
          const response = await axios.get(`http://localhost:8000/api/wayfinding/${bldg.id}`);
          setLotResults(response.data);
        }catch(err){
          console.error("Error fetching lot results:", err);
          alert('Error fetching lot results');
        }
      }else{
        alert('INVALID bldg');
      }
    }
  };

  const inputProps = {
    placeholder: `Search for a ${searchType}`,
    value,
    onChange,
    onKeyDown: handleKeyDown
  };

  // Custom theme for styling
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
