import React from 'react';

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
              <td>{sub.about.memberCount}</td>
              <td>Created</td>
              <td>{sub.about.blurb}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
