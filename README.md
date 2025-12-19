<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">TickeZ</h3>

  <p align="center">
    A comprehensive full-stack event management and ticketing platform.
    <br />
    <a href="ticket-system-backend/README.md"><strong>Explore Backend Docs »</strong></a>
    ·
    <a href="ticket-system-frontend/README.md"><strong>Explore Frontend Docs »</strong></a>
    <br />
    <br />
    <a href="#demo">View Demo</a>
    &middot;
    <a href="#issues">Report Bug</a>
    &middot;
    <a href="#issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This project is a robust solution designed to facilitate the entire lifecycle of event management. It serves three main user roles: Customers, Event Organizers, and Administrators. The system allows organizers to create and manage events, customers to browse and book tickets, and administrators to oversee the platform's operations.

Key capabilities include:
*   **Event Management**: Comprehensive tools for organizers to create, update, and manage event details.
*   **Ticket Booking**: Real-time availability checks and secure booking flows for customers.
*   **Payment Processing**: Integrated secure payments for seamless transactions.
*   **Administration**: Content moderation and user management features for system admins.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This project leverages a modern, scalable technology stack.

* [![NestJS][NestJS]][NestJS-url]
* [![React][React.js]][React-url]
* [![TailwindCSS][TailwindCSS]][TailwindCSS-url]
* [![MongoDB][MongoDB]][MongoDB-url]
* [![Docker][Docker]][Docker-url]
* [![Prisma][Prisma]][Prisma-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running, please refer to the detailed instructions provided in the respective directories.

### Prerequisites

*   Node.js (v18+)
*   Docker (Recommended for Database)

### Installation

1.  **Backend Setup**
    Please refer to the [Backend README](ticket-system-backend/README.md) for detailed setup instructions, including environment configuration and database migration.

2.  **Frontend Setup**
    Please refer to the [Frontend README](ticket-system-frontend/README.md) for installation and development server startup instructions.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

The application is divided into two main components:

1.  **Backend API**: Runs on port 3000 (default). It handles all business logic, database interactions, and authentication.
2.  **Frontend Client**: Runs on port 5173 (default). It provides the user interface for Customers, Organizers, and Admins.

Once both services are running, you can access the application via your browser.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Requirements Elicitation & Analysis
- [x] System Modeling (Use Case, Activity, Sequence, Class Diagrams)
- [x] Architecture Design (Clean Architecture, Database Design)
- [x] Sprint 1: Core Features
    - [x] Authentication & Authorization
    - [x] Event Creation & Management
    - [x] Admin Approval Workflow
- [x] Sprint 2: Advanced Features
    - [x] Ticket Booking & Payment Integration
    - [x] User Dashboard & History
- [ ] Cloud Deployment & CI/CD
- [ ] Advanced Testing & Validation

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Project Link: [https://github.com/bibimoni/TicketSystem](https://github.com/bibimoni/TicketSystem)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[NestJS]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[NestJS-url]: https://nestjs.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCSS]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Docker]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[Prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/

