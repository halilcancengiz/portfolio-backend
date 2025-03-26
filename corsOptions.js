const origins = ["https://www.halilcancengiz.com", "https://halilcancengiz.com", "http://localhost:5173"];

const corsOptions = (req, callback) => {
    const requestOrigin = req.header("Origin"); // Gelen isteğin Origin değerini al

    if (requestOrigin && origins.includes(requestOrigin)) {
        callback(null, {
            origin: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
        });
    } else {
        callback(null, { origin: false });
    }
};

module.exports = corsOptions;