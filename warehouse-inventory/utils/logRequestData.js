export default (req, res, next) => {
    console.log('Logging request data:', {
        body: req.body,
        query: req.query,
        params: req.params,
    });
    next();
};
