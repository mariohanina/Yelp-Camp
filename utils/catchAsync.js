// Catch errors for async functions, I don't know why it has to be so confusing though
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}