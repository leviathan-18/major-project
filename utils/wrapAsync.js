/*module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};*/

module.exports = (fn) => {
    //console.log('fn:', fn); // Log the input
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
