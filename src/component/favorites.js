import React, { useEffect, useState, useContext } from 'react';
import { FavoriteContext } from '../context/favoriteContext';
import { Button, IconButton } from '@material-ui/core';
import { Link, useHistory } from "react-router-dom";
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
const Favorites = () => {

    const history = useHistory();

    const { favorites, setFavorites } = useContext(FavoriteContext)


    useEffect(() => {
        console.log(favorites)
    }, [])
    const backToHome = () => {
        history.push('/')
    }
    const removeCity = (index) => {
        console.log(index)
        let newArr;
        if (index > -1) {
            newArr = favorites.filter((favorite, i) => {
                return index !== i
            });
            setFavorites([...newArr])
        }
    }


    // return (
    //     <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
    //         <header style={{ fontSize: '3rem', marginBottom: '3rem' }} >The Weather</header>
    //         <h1>Favorites</h1>
    //         <IconButton onClick={backToHome} style={{ position: 'absolute', left: '2rem', top: '2rem' }}><ArrowBackIcon /></IconButton>
    //         <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    //             {/* <div style={{ display: 'flex', flexDirection: 'row-reverse', textAlign: 'center' }} > */}
    //             <Link  >
    //                 <Button style={{
    //                     color: 'black', border: '1px black solid',
    //                     backgroundColor: 'white', marginBottom: '1rem'
    //                 }}>
    //                     lidor
    //                     </Button>
    //             </Link>
    //             <IconButton > <RestoreFromTrashIcon /></IconButton>
    //             {/* </div> */}
    //         </div>
    //     </div>
    // )

    return (
        <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
            <header style={{ fontSize: '3rem', marginBottom: '3rem' }} >The Weather</header>
            <h1>Favorites</h1>
            <IconButton onClick={backToHome} style={{ position: 'absolute', left: '2rem', top: '2rem' }}><ArrowBackIcon /></IconButton>
            {favorites.length > 0 ?
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 35% 0 35%' }}>
                    {favorites.map((fav, index) => {
                        console.log(fav)
                        return (
                            <div style={{ marginBottom: '1rem' }} key={index}>
                                <Link to={{ pathname: '/', state: fav }} >
                                    <Button style={{ color: 'black', border: '1px black solid', backgroundColor: 'white' }}>
                                        {fav.city}
                                    </Button>
                                </Link>
                                <IconButton onClick={() => removeCity(index)}> <RestoreFromTrashIcon /></IconButton>
                            </div>
                        )
                    })
                    }
                </div>
                : <div>לא נמצאו ערים במועדפים</div>
            }
        </div>
    )
}

export default Favorites;