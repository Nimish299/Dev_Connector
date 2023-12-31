import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
const Profileitem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills,
  },
}) => {
  return (
    <section className='containerprofile'>
      <div className='profile bg-light'>
        <img src={avatar} alt='' className='round-img' />
        <div>
          <h2>{name}</h2>
          <p>
            {status} {company && <span>at {company}</span>}
          </p>

          <div class='row'>
            <div class='col'>
              <p className='my-1'>{location && <span>{location}</span>}</p>
              <Link to={`/profile/${_id}`} className='btn btn-primary'>
                View Profile
              </Link>
            </div>
            <div class='col'>
              <ul>
                {skills.slice(0, 4).map((skill, index) => (
                  <li key={index} className='text-primary'>
                    <i className='fas fa-check'></i>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Profileitem.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default Profileitem;
