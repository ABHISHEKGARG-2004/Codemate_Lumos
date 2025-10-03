const axios = require('axios');

const languageMap = {
    'javascript': { language: 'nodejs', versionIndex: '4' }, // Node.js 18.15.0
    'python':     { language: 'python3', versionIndex: '4' },  // Python 3.9.9
    'cpp':        { language: 'cpp17', versionIndex: '1' },   // C++ (g++ 11.2.0)
    'java':       { language: 'java', versionIndex: '4' }     // JDK 17.0.1
};

exports.executeCode = async (req, res) => {
    const { language, code, stdin } = req.body;

    const langDetails = languageMap[language];
    if (!langDetails) {
        return res.status(400).json({ message: `Language '${language}' is not supported.` });
    }

    const program = {
        script: code,
        stdin: stdin || '',
        language: langDetails.language,
        versionIndex: langDetails.versionIndex,
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    };

    try {
        const response = await axios.post('https://api.jdoodle.com/v1/execute', program, {
            headers: { 'Content-Type': 'application/json' }
        });

        // JDoodle returns an 'output' field. We will send this back to the frontend.
        // We'll mimic the structure Judge0 used for simplicity on the frontend.
        res.json({
            stdout: response.data.output,
            stderr: null, // JDoodle combines output, so we'll put everything in stdout
            compile_output: null,
            message: '',
            status: { id: response.data.statusCode === 200 ? 3 : 11, description: 'OK' }
        });

    } catch (error) {
        console.error('JDoodle API Error:', error.response ? error.response.data : error.message);
        res.status(error.response?.status || 500).json({
            message: 'Error executing code',
            error: error.response?.data || { message: error.message }
        });
    }
};

