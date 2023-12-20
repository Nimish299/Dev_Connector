import './App.css';
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './componenets/layout/Navbar';
// import Dashboard from './componenets/dashboard/Dashboard';
import Dashboard from './componenets/dashboard/Dashboard';
import Landing from './componenets/layout/Landing';
import Register from './componenets/auth/Register';
import Login from './componenets/auth/Login';
import Alert from './componenets/layout/Alert';
import CreateProfile from './componenets/profile-forms/CreateProfile';
import EditProfile from './componenets/profile-forms/EditProfile';
import Posts from './componenets/posts/Posts';
import Post from './componenets/post/Post';

import PrivateRoute from './componenets/routing/PrivateRoute';
import AddExperience from './componenets/profile-forms/AddExperience';
import AddEducation from './componenets/profile-forms/AddEducation';
//redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Profiles from './componenets/profiles/Profiles';
import PageNotFound from './componenets/layout/PageNotFound';
import Profile from './componenets/profile/Profile';
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <div className='mainbody'>
            <Alert />
            <Routes>
              <Route exact path='/' element={<Landing />} />
              <Route exact path='/register' element={<Register />} />
              <Route exact path='/login' element={<Login />} />
              <Route exact path='/profiles' element={<Profiles />} />
              <Route exact path='/profile/:id' element={<Profile />} />
              {/* <Route element={<PageNotFound />} /> */}

              <Route exact element={<PrivateRoute />}>
                <Route exact path='/dashboard' element={<Dashboard />} />
                <Route
                  exact
                  path='/create-profile'
                  element={<CreateProfile />}
                />
                <Route exact path='/edit-profile' element={<EditProfile />} />
                <Route
                  exact
                  path='/add-experience'
                  element={<AddExperience />}
                />
                <Route exact path='/add-education' element={<AddEducation />} />
                <Route exact path='/posts' element={<Posts />} />
                <Route exact path='/posts/:id' element={<Post />} />
              </Route>
              <Route Component={PageNotFound} />
            </Routes>
          </div>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
