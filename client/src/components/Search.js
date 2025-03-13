// AutocompleteSearch.js
import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import '../stylesheets/Search.css'; // Import CSS file for custom styling

const AutocompleteSearch = ({ value, setValue, searchType }) => {
  const [suggestions, setSuggestions] = useState([]);

  // Mock data for suggestions
  const languages = [
    'React',
    'Angular',
    'Vue.js',
    'Ember.js',
    'Backbone.js',
    'Svelte',
    'Express.js',
    'Meteor.js',
    'Next.js',
    'Nuxt.js'
  ];

  const getSuggestions = (inputValue) => {
    const regex = new RegExp(inputValue.trim(), 'i');
    return languages.filter((language) => regex.test(language));
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

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => {
    console.log(suggestion);
    return <div>{suggestion}</div>;
  }

  const inputProps = {
    placeholder: `Search for a ${searchType}`,
    value,
    onChange
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
