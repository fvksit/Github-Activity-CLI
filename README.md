# GitHub Activity CLI

https://roadmap.sh/projects/github-user-activity

A simple command line interface (CLI) application to fetch and display the recent activity of a GitHub user using the GitHub API.

## Features

- Fetch the recent activity of a specified GitHub user.
- Display different types of activities, such as `PushEvent`, `IssuesEvent`, `ForkEvent`, and more.
- Option to filter activities by event type.

## How to Run the Project

### Prerequisites:

- Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/github-activity-cli.git
   cd github-activity-cli
   ```

2. Run the CLI application:

   ```bash
   node index.js <github-username>
   ```

3. Optionally, filter activities by event type:
   ```bash
   node index.js <github-username> <event-type>
   ```
