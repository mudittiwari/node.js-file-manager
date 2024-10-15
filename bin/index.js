#!/usr/bin/env node
import shell from "shelljs";
import inquirer from "inquirer";
import path from "path";
import degit from "degit";

async function run() {
    const { projectName } = await inquirer.prompt([
        {
            type: "input",
            name: "projectName",
            message: "Enter the project name (folder will be created):",
            default: "my-mern-app"
        }
    ]);

    // Clone the repository into the specified project name folder
    console.log("Cloning the repository...");
    const emitter = degit("mudittiwari/node.js-file-manager", { force: true });
    await emitter.clone(projectName);

    // Install dependencies for the backend and frontend
    console.log("Installing dependencies for the backend...");
    shell.cd(path.join(projectName, "backend"));
    shell.exec("npm install");

    console.log("Installing dependencies for the frontend...");
    shell.cd(path.join("..", "frontend"));
    shell.exec("npm install");

    // Instructions to run the project
    console.log(`\nSetup complete! To get started:\n`);
    console.log(`cd ${projectName}/backend`);
    console.log(`npm run start # to start the backend server`);
    console.log(`cd ../frontend`);
    console.log(`npm run start # to start the frontend server`);
}

run().catch((error) => {
    console.error("An error occurred:", error);
});
