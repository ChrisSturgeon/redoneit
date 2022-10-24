import React from 'react';
import { Link } from 'react-router-dom';

export default function SubredditsTable({ subsData }) {
  return (
    <table className="all-subs-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Members</th>
          <th>Created</th>
          <th>About</th>
        </tr>
      </thead>
      <tbody>
        {subsData.map((sub) => {
          return (
            <tr key={sub.subName}>
              <td>{sub.displayName}</td>
              <td>{sub.displayName}</td>
              <td>Created</td>
              {/* <td>{sub.about.blurb}</td> */}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
