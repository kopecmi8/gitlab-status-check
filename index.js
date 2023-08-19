const express = require('express');
const app = express();

app.post('/projects/:id/merge_requests/:merge_request_iid/status_check_responses', (req, res) => {
    const projectId = req.params.id;
    const { id, name, external_url, status } = req.body;


    res.json({
        id,
        name,
        external_url,
        status: "passed"
    });
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});