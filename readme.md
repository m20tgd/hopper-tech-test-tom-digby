# Hopper Tech Test

## Getting Started

Please refer to [coding-exercise.md](./coding-exercise.md) for the full problem description and instructions.

## Submitting your solution

Create you solution in a fork of this repository. Once you're ready to submit, please add dmanning-resilient as a collaborate on your private repository and send us a message.

## Candidate Notes

<!-- 
  Please update this section with details about your solution, including:
  - How to install dependencies and run your code (if applicable)
  - Any assumptions or trade-offs you made
  - Anything else you'd like the reviewer to know
-->

### Installation and Usage

Clone the repository and naviagate the directory and run ```npm i``` to install the dependencies. If you use VsCode Dev Containers, you can open the folder in a container for a sterile environment in which the code is guaranteed to run.

The code can be executed via a simple Jest test suite. This sends dummy data to the call handler and checks that a positive reponse is returned within 500ms. It then calls the function that reads the message from queue and enriches and stored the data. It checks that this function runs without throwing an error. If using VsCode, you can start the tests by pressing F5. Alternatively, you can run the tests via the command line with ```npx jest```.

### Queuing System

I decided to implement a queueing system to allow the call handler to quickly return a response after parsing and validating the data. This allows the time consuming process of enriching and storing the data to be done asynchronously. For a real life production system, I would use a more robust system, such as AWS SQS, but for the purposes of this execercise I implemented a simple lightweight database designed for this purpose using a node package called "level". For a proper application the function that reads from the queue would be a contnuously running process or triggered by an event, but for this exercise, it is manually invoked in the test suite.

I decided to add the parsed records to the queue in one chunk rather than adding them all individually. This is from experience of implementing a similar queue in which a laarge number of writes to the database during times of high traffic prevented the database being read from, so the queue just grew larger and no data was processed. 

### Database and Index Seach Choices

I was not familiar with index searching and my research into it provided Elasticsearch as a common solution and explained how it can be used in conjunction with a database such as Postgres. I understand from my research that the Postgres (or other relational database) is used as the "source of truth" for the data and for complex queries, while Elasticsearch is used for its powerful full text search capabilities and speed. I'm familiar with Postgres myself and Elasticsearch was given as an example by yourselves and seemed to be the main choice from my research, so I chose them for the purposes of this exercises. I researched some node packages to integrate them with my code and created mocks of these for the purposes of this exercise.

### Assumptions and Trade-offs

I assumed that it was ok for the handler to acknowledge successful receipt of the data before it has been enriched and stored, as long as the data has been parsed and validated. This is a trade off as the calling process will not know if the data has been successfully enriched and stored, but it allows the handler to meet the 500ms acknowledgment requirement. I felt this was a reasonable assumption as the instructions state that the handler must acknowledge receipt quickly, but do not specify that it must wait until the data has been enriched and stored before acknowledging receipt.

I made the assumption that all records passed via the API would be valid. I validate the data by ensuring the message is not empty (in line with the instructions) and that the data can be parsed to CSV. I do not check to make sure that the records contain the right fields or that the data in these fields are valid (e.g. that the call start and end times are valid ISO 8601 timestamps). In a real application I would implement this validation, but I felt it was out of scope for this exercise and that I had already demonstrated validation checks and error handling. I do not believe these checks would cause the handler to take more than 500ms to respond.

I also made the assumption that the operator-lookup API would eventually be successful and return data. In a real application I would implement retry logic and a dead letter queue to handle cases where the API is consistently failing, but I felt this was out of scope for this exercise.

### Use of AI Tools

I used AI as a research tool for this exercise (I use it instead of Google now for these purposes). I have GitHub Co-Pilot enabled in my VsCode and I used this for auto-completion. I also used it to boilerplate configuration files and the Jest test suite. I used it to create the mock Postgres and Elasticsearch clients, as I know from previous experience that creating mocks can be time consuming and technical and I didn't want to waste time doing this. All other code is my own work, sometimes based on suggestions from my AI based research. This exercise was completed by myself assisted by AI, not by AI alone. I understand the code I have written and am happy to discuss any part of it in more detail if required.