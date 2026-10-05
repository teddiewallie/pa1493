# PA1493 Software Development Project (Distance) HT26

---

## Project Description

**Project Name:** *Lab Equipment Knowledge Hub*

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

**Functional Requirements** (~~strikethrough~~ means implemented)

**Must**

* ~~The system must allow users to log in.~~
* ~~The system must allow new users to be created.~~
* ~~The system must have role based access.~~
* ~~The system must allow the following information to be added for each item:~~
    - ~~Item name~~
    - ~~Item type~~
    - ~~Item serial number~~
    - ~~Item photo~~
* ~~The system must allow users to view the item specifics.~~
* The system must allow full text search through all faults, guides, and projects.
* ~~The system must allow distinguishing between types and units.~~
* ~~The system must restrict users according to their role.~~
* ~~The system must allow students to submit articles to the idea catalogue.~~
* ~~The system must allow students to read articles in the idea catalogue.~~
* The system must allow students to (request to) borrow and return items, with start and end dates.
* The system must allow the unit to be returned.
* ~~The system must allow to mark an item as out of service.~~
* The system must allow users to report a known fault on a specific unit.
* ~~The system must allow caretakers to report a known fault on a whole type.~~
* ~~The system must allow users to record a finished project and link the article to the used equipment.~~
  - Multiple equipment and "Related Articles" section in each mentioned type?

**Should**

* ~~The system should allow QR codes to be scanned from PC or phone cameras.~~
* ~~The system should allow adding QR codes for each item.~~
* ~~The system should allow label printing~~.
* The system should allow searching on the following fields for each item:
    - Item name
    - Item type
    - Item serial number

**Could**

* The system could have pagination.
* The system could have a "what can I build with this" link from any item page.
* The system could allow the following information to be added for each item:
    - Kit definitions with contents checklists.
    - Datasheets
    - OS Images
* The system could have lazy loading.
* The system could have an an audit log.
* The system could allow import items from CSV or JSON.
* The system could allow storing documents and media.
* The system could have usage statistics.
* The system could have induction, gating what may be borrowed.
* The system could filter search by availability, category, difficulty, required skill.
* The system could allow users to rate and comment on articles in the idea bank.

**Non-Functional Requirements**

* ~~The system could use the following tech stack:~~
    - ~~Node.js~~
    - ~~React~~
    - ~~Relational database~~
* The images could be optimized for a reasonable balance between size and quality.
* The system could cache information.
* ~~The system could have a REST API. (NextJS uses server and client components. There is a REST API endpoint for assets.)~~
* ~~The system could be mobile first.~~
* ~~The system could have input validation where it makes sense.~~

### Acceptance Criteria

| # | Acceptance criterion | Scenario | Expected result |
|---:|---|---|---|
| ✅1 | **User registration** | An account for a user can be created. | A new account is created and the user can log in with it. |
| ✅2 | **Login and roles** | A student logs in, then a caretaker logs in. | Both reach the system, and the two roles do not see the same thing. A student cannot reach caretaker functions. |
| ✅3 | **Equipment types and units** | A caretaker adds an item type and registers several individual units of it. | The type exists once and the units exist separately, each with its own identifier, location and condition. |
| ✅4 | **Browse equipment** | A student opens the equipment list. | Equipment is listed with its category and whether it is currently available. |
| ✅5 | **One unit out of service** | A caretaker marks one unit of a type as out of service, and a student then opens that type. | The type still shows as available, the remaining units can be borrowed, and the broken unit cannot. |
| ✅6 | **Equipment guide** | A student opens a piece of equipment and looks for instructions. | A setup or usage guide in text for that equipment is reachable from the equipment page. |
| ✅7 | **Report a fault** | A student reports a fault on a specific unit. | The fault is recorded against that unit, a caretaker can see it, and the fault is visible on the unit. |
| ✅8 | **Fault on a whole type** | A caretaker records a known problem against an item type rather than a single unit. | The problem is shown on every unit of that type without being entered again. |
| 9 | **Borrow request with dates** | A student requests to borrow a unit. | The request covers a period with a start and an end date, and is recorded as pending. |
| 10 | **Return** | A borrowed unit is returned. | The loan is closed, the unit becomes available again, and the loan appears in that unit’s history. |
| ✅11 | **Usable on a phone** | A student opens the equipment list and an equipment guide on a phone. | Both are readable and usable on a phone screen, without horizontal scrolling or zooming to read. |
| ✅12 | **Project library** | A student records a finished project and states which equipment was used, then opens that equipment. | The project is saved and is reachable from the equipment it used. |
| ✅13 | **Search** | A user searches for a term that appears in equipment, guides and projects. | Matching results are returned across those areas and can be opened. |


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

If dummy data is added, then there are a few more accounts you can try out. Adam should have the admin role honestly. Will fix if I remember to.

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

I do continous delivery. As soon as a new branch merges with main, a new version of the app is deployed at https://lekh.ted.pm

### Installing

* Make sure `docker` and `docker-compose` are installed.
* Navigate into the `lekh` directory.
* Copy .env.example to .env and update any fields as needed.

### Running

* Run `docker compose up`.
* When the logs stops going brrr, navigate to http://localhost:3000

### Updating

* Run `docker compose down`
* Run `git pull`
* Run `docker compose up --build`

### Development Environment

* Navigate to the `lekh` directory.
* Copy `.env.example` to `.env`.
* Run `docker compose -f compose-dev.yaml up -d`
* Navigate to the app directory.
* run `./dev-load-env.sh`
    - If if fails, run `sudo chmod +x dev-load-env.sh` and try again.

