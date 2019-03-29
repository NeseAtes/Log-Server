var EndSession = function(req, res, next)
 {    
    if (res.locals.responseType && res.locals.responseType == "xml") {
        res.send(res.locals.data);
        res.end();
    } else if (res.locals.responseType && res.locals.responseType == "file") { 
        res.end();
    } else {
        res.json(res.locals.data);
    }
};

module.exports.EndSession = EndSession;