exports.error = (req, res, next) => {
    res.status(404);
    //res.sendFile(path.join(__dirname, 'views', '404.html'));
    res.render('404',{docTitle:'Page not found using ejs'});
}