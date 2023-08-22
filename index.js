const express = require('express');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());


function targetBranchRequiresTestsToBeRun(branchName) {
    return branchName === "master" || branchName === "main" || branchName.includes("release-")
}

app.post('/webhook', (req, res) => {
    // Get the event name from the request body
    const eventType = req.body.event_type;
    const objectAttributes = req.body.object_attributes
    const mergeRequestId = objectAttributes.id
    const workInProgress = objectAttributes.work_in_progress
    const mrState = objectAttributes.state;
    const targetBranch = objectAttributes.target_branch
    const sourceBranch = objectAttributes.source_branch


    // Check if the event is a merge_request event and the merge request state is ready to be merged
    if (eventType === 'merge_request' && mrState === 'opened' && !workInProgress && targetBranchRequiresTestsToBeRun(targetBranch)) {
        // Get the pipeline trigger token from the environment
        const token = process.env.PIPELINE_TRIGGER_TOKEN;

        // Trigger the pipeline
        const url = `https://gitlab.ataccama.dev/api/v4/projects/356/ref/${sourceBranch}/trigger/pipeline?token=${token}`;
        const data = {
            ref: `refs/heads/${sourceBranch}`,
        };
        console.log("should trigger pipeline", sourceBranch, token, url, data)

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    res.status(200).send('Webhook received');
});


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});