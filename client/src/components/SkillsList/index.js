import React from 'react';
import { useMutation } from '@apollo/client';

import { REMOVE_SKILL } from '../../utils/mutations';
import { QUERY_ME } from '../../utils/queries';
import { ADD_ENDORSEMENT } from '../../utils/mutations';
import { QUERY_SINGLE_PROFILE } from '../../utils/queries';

const SkillsList = ({ skills, isLoggedInUser = false }) => {

  const [addEndorsement, { err }] = useMutation(ADD_ENDORSEMENT, {
    update(cache, { data: { addEndorsement } }) {
      try {
        const { endorsement } = cache.readQuery({ query: QUERY_SINGLE_PROFILE})
        console.log(endorsement)
        cache.writeQuery({
          query: addEndorsement,
          data: { _id: endorsement.id, skill: endorsement.skill, count: endorsement.count=+1 },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const handleAddEndorsement = async (skill) => {
    try {
      alert(skill);
      const { data } = await addEndorsement({
        variables: { skill },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [removeSkill, { error }] = useMutation(REMOVE_SKILL, {
    update(cache, { data: { removeSkill }}) {
      try {
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: removeSkill },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const handleRemoveSkill = async (skill) => {
    try {
      const { data } = await removeSkill({
        variables: { skill },
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!skills.length) {
    return <h3>No Skills Yet</h3>;
  }

  return (
    <div>
      <div className="flex-row justify-space-between my-4">
        {skills &&
          skills.map((skill) => (
            <div key={skill} className="col-12 col-xl-6">
              <div className="card mb-3">
              {/* <button
                      className="btn btn-sm btn-danger ml-auto"
                      onClick={() => handleAddEndorsement(skill)}
                  
                    >
                      +
                    </button>
              <h2>{skill.count || 20}</h2> */}
                <h4 className="card-header bg-dark text-light p-2 m-0 display-flex align-center">
                <button
                      className="btn btn-sm"
                      onClick={() => handleAddEndorsement(skill)}
                  
                    >
                      +
                    </button>
                  <span>{skill}</span>
                  <h2 className="ml-auto">{skill.count || 20}</h2>
                  {isLoggedInUser && (
                    <button
                      className="btn btn-sm btn-danger ml-auto"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      X
                    </button>
                  )}
                </h4>
              </div>
            </div>
          ))}
      </div>
      {error && (
        <div className="my-3 p-3 bg-danger text-white">{error.message || err.message}</div>
      )}
    </div>
  );
};

export default SkillsList;
