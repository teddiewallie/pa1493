# PA1493 Software Development Project (Distance) HT26

---

## Project Description

**Project Name:** *ProjectProposal-LabEquipmentKnowledgeHub-ZAD*

**Customer Name:** *Zeth Danielsson*

**Student Full Name:** *Ted Wall*

### Project Aim and Objectives

The aim of this project is to develop a prototype that makes it easier to manage laboratory equipment and to maintain knowledge hub so that it is not lost when the people that holds the knowledge moves on.

Specifically the aim is to:

* Build a hub to share knowledge to students so that they know how to use it.
* Add a maintainer aspect to the system so that staff can maintain equipment.
* Design a highly usable and accessible frontend for every aspect and role involved.
* Develop a system where people can book and loan laboratory equipment.

### User Personas

| Name | Characteristics | Needs and Expectations | How will they use the system? |
|---|---|---|---|
| Bob | 45, maintainer, high tech skill level | Bob needs a system that tracks the condition of the equipment. | He uses the system to know when the equipment needs maintenance, as well as keeping track of broken equipment. |
| Lisa | 20, student, medium skill level. interested and curious, but still new | Lisa wants to learn more about technology by reading in the knowledge hub and borrow the equipment. | She borrows the equipment and is engaged in the knowledge hub, both as a consumer as well as writing about her own findings. |
| Adam | 24, student assistant and maintainer, high tech skill level | Adam both maintains and uses the equipment, and is an avid user of the knowledge hub as a writer. | Adam uses all parts of the system and is probably the person that will know every nook and cranny of it. |

### Software Requirements

**Functional Requirements**

**Must**

* The system must allow users to log in.
* The system must allow new users to be created.
* The system must have role based access.
* The system must allow the following information to be added for each item:
    - Item name
    - Item type
    - Item serial number
    - Item photo
* The system must allow users to view the item specifics.
* The system must allow searching on the following fields for each item:
    - Item name
    - Item type
    - Item serial number
* The system must restrict users according to their role.
* The system must allow students to submit articles to the idea catalogue.
* The system must allow students to read articles in the idea catalogue.

**Should**

* The system should have a "what can I build with this" link from any item page.
* The system should have pagination.

**Could**

* The system could allow users to borrow and return items.
* The system could allow the following information to be added for each item:
    - Kit definitions with contents checklists.
    - Datasheets
    - OS Images
* The system could allow label printing.
* The system could have lazy loading.
* The system could have an an audit log.
* The system could allow import items from CSV or JSON.
* The system could allow full text search through all faults, guides, and projects.
* The system could allow storing documents and media.
* The system could have usage statistics.
* The system could have induction, gating what may be borrowed.
* The system could filter search by availability, category, difficulty, required skill.
* The system could allow QR codes to be scanned from PC or phone cameras.
* The system could allow adding QR codes for each item.
* The system could allow users to rate and comment on articles in the idea bank.

**Non-Functional Requirements**

* The system could use the following tech stack:
    - Node.js
    - React
    - Relational database
* The images could be optimized for a reasonable balance between size and quality.
* The system could cache information.
* The system could have a REST API.
* The system could be mobile first.
* The system could have input validation where it makes sense.

## Your Backlog

Your backlog lives in two places, working together:

### 1. GitHub Issues (the content)

For every user story, feature, and task, create a GitHub Issue with a clear title and description. Use the issue template provided in this repository (see `.github/ISSUE_TEMPLATE/`).

Write them in this order:
1. All **user stories** first (format: *"As [a user], I want [action] so that [goal]"*)
2. Then all **features**
3. Then all **tasks**

### 2. Project Board (the backlog itself)

Add every Issue to a Project board. The board is your backlog, not the issue text.

Your repository does not come with a board already set up — see **[PROJECT_BOARD.md](PROJECT_BOARD.md)** for step-by-step instructions on creating your board and setting up the required fields (Priority, Estimated Effort, Sprint). 

You'll need a working board by the end of Sprint 1, as Status Report 3 requires it.


---

## Development

From Week 38 onward:
- Set up your development environment and start development.
- You're free to organise your code however works best for you — for example, using `src/` and `docs/` folders, or any other structure. There's no required folder layout; 
- At the end of each sprint, your work will be demonstrated to the customer at that sprint's Demo
- Keep this README as the one place that always explains how to install and run your project.


Your repository must remain **Private** for the entire course. This protects your customer's requirements and your own work.

---

## Documenting Your Project

### Default Credentials

Default account is `admin@home.arpa` and password `admin`.

If dummy data is added, then there are a few more accounts you can try out:

| Name | E-mail | Password | Role |
| ---- | ------ | -------- | ---- |
| Bob Bobson | bob@home.arpa | arpa | Admin |
| Lisa Lisadotter | lisa@home.arpa | arpa | Student |
| Adam Adamsson | adam@home.arpa | arpa | Student |
| Eva Eriksson | eva@home.arpa | arpa | Student |
| Fredrik Frisk | fredrik@home.arpa | arpa | Student |
| Gustav Gustavsson | gustav@home.arpa | arpa | Student |
| Hanna Holm | hanna@home.arpa | arpa | Student |
| Ida Isaksson | ida@home.arpa | arpa | Student |
| Johan Johansson | johan@home.arpa | arpa | Student |

### Fast Track

The app is deployed at https://lekh.ted.pm

### Installing

* Make sure `docker` and `docker-compose` are installed.
* Navigate into the `lekh` directory.
* Copy .env.example to .env and update any fields as needed.

### Running

* Run `docker compose up`.
* When the logs stops going brrr, navigate to http://localhost:3000

### Development Environment

* Navigate to the `lekh` directory.
* Copy `.env.example` to `.env`.
* Run `docker compose -f compose-dev.yaml up -d`
* Navigate to the app directory.
* run `./dev-load-env.sh`
    - If if fails, run `sudo chmod +x dev-load-env.sh` and try again.

