import React, { useEffect, useContext, useState } from 'react';
import { FavoriteContext } from '../context/favoriteContext';
import { TextField, IconButton } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';


const Search = ({ value, onChange, options, getInfo, }) => {


    return (

        <Autocomplete
            id="combo-box-demo"
            options={options}
            getOptionLabel={(option) => option.city && option.city + ', ' + option.country}
            style={{}}
            onChange={getInfo}
            renderInput={(params) => <TextField {...params} value={value}
                label="הכנס שם של עיר באנגלית" variant="outlined" onChange={onChange} />}
        />


    )
}

export default Search;