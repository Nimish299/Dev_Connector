import React, { Fragment } from 'react';

const PageNotFound = () => {
  console.log('PageNotFound component rendered'); // Add this line
  return (
    <Fragment>
      <h1 className='x-large text-primary'>
        <i className='fas fa-exclamation-triangle'></i>Page Not Found
      </h1>
      <p className='large'>Sorry, This page Does Not Exist</p>
    </Fragment>
  );
};

export default PageNotFound;
