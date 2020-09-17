import React, { useState } from 'react';
import './App.css';
import { FavoriteContext } from './context/favoriteContext';
import Home from './component/home';
import Favorites from './component/favorites';
import Search from './component/search';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
function App() {
  const [favorites, setFavorites] = useState([])
  return (
    <Router>
      {/* <FavoriteContext.Provider value={{ favorites, setFavorites }}>
        <Route path='/'><Search /></Route>
      </FavoriteContext.Provider> */}
      <Switch>
        <FavoriteContext.Provider value={{ favorites, setFavorites }}>
          <Route exact path='/'><Home /></Route>
          <Route path='/favorites'><Favorites /></Route>
        </FavoriteContext.Provider>
      </Switch>
    </Router>
  );
}

export default App;
