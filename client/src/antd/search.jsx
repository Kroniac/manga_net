import React from 'react';
import { Input, AutoComplete } from 'antd';

const Search = (props) => (
  <AutoComplete
    dropdownMatchSelectWidth = {252}
    style = {props.frameStyles}
    onChange = {props.onChange}
    defaultOpen = {false}
    options = {props.options}
    onSelect = {props.onSelect}
  >
    <Input.Search style = {props.inputStyles} size = "large" placeholder = {props.placeholder} />
  </AutoComplete>
);

export default Search;
