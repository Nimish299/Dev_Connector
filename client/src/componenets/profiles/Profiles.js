import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
// import Spinner from '../layout/Spinner';
import Spinner from '../layout/Spinner';
import { getProfiles } from '../../actions/profile';
import Profileitem from './Profileitem';
const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  //   console.log(profiles) ;
  //   console.log('length=>>>>', profiles.length);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop'>
              Browser and connect with developers
            </i>
          </p>

          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <Profileitem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No Profiles Found..</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
