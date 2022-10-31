# redoneit

## Table of Contents

- [Overview](#overview)
- [Built With](#built-with)
- [Features](#features)
- [Concepts and Ideas Learnt](#concepts-and-ideas-learnt)
- [Areas to Improve](#areas-to-improve)
- [Contact](#contact)

## Overview

A remake of Reddit as my final project of the Javascript module from [The Odin Project](https://www.theodinproject.com/).

View the live project [here](https://chrissturgeon.github.io/redoneit/) and view the project guidelines [here](https://www.theodinproject.com/lessons/node-path-javascript-javascript-final-project).

![Front page screenshot](/redoneit/src/imgs/RedoneitHomepage.jpg 'Front Page')

### Built With

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/en/main)
- [Firebase - Firestore & Authentication](https://firebase.google.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Javascript](https://www.javascript.com/)
- [date-fns](https://date-fns.org/docs/Getting-Started)
- HTML
- CSS

## Features

- Individual User Accounts.
- Ability to post links, comments and a replies.
- Individual karma tracking with ability to upvote/downvote posts.
- Create subreddits with unique colour-schemes.

### Concepts and Ideas Learnt

This was by far the largest project I have undertaken and, although I have used some of these frameworks and libraries before, the size of this project really helped cement some of the programming concepts which I was already aware of - as well as introducing new ones. For example:

- How frameworks such as **React** are incredibly useful for rendering dynamic content with re-usable components when combined with data from a backend.

- BaaS products such as **Firebase** are very helpful with getting up and running quickly, allowing me to spend more time enhancing my frontend skill-set whilst still having functionality such as user accounts.

- The importance of **asynchronous functions** when working with data retrieved from a backend, and how to handle any waiting time within React and the UI.

- Although I have yet to full delve into **data-structures**, it was interesting to consider how to structure the data for this project in a way which would result in a minimal amount of reads from Firestore, and to see how decisions made early on would affect scalability and efficiency if the project was to receive a lot of use later.

- How to create React components with **responsive design** in mind, using a combination of hooks and CSS.

- The value of **well-organised structure** for larger projects to ensure creating, finding, and referencing other files is quick and easy.

- How libraries such as **Framer Motion** can easily give an interactive, modern feel to websites. I used some basic animations within the project, such as sliding in/down for expanding menus, modals etc. and am looking forward to diving deeper on this topic in future.

- That minmising my IDE and taking five minutes to work through a problem in **pseudo-code** with a pencil and paper saves multiples of this when compared to a trial and error 'code-and-hope' approach. Similarly, **planning** (and sticking to the plan) saves time and prevents mission creep. For this, I created a Trello board wih a card and checklist for each large function and component to keep on-track of its development.

### Areas to Improve

With more time I would have liked to have implemented more features and improved others, such as:

- User profiles with customisable pictures, links to their recent activity (posts and comments) and friends list.

- Have users upload images to my Firestore directly, rather than using external links when creating posts.

- Create a set of standardised CSS classes to use throughout different components as currently some of the CSS styling is repeated.

## Contact

- sturgeon.chris@gmail.com
- [LinkedIn](https://www.linkedin.com/in/chris-sturgeon-36a74254/)
