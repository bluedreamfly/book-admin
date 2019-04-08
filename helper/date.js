const getDateRange = (date) => {
    let oyear = date.getFullYear();
    let omonth = date.getMonth();
    let day = date.getDate();
    let month = omonth;
    let year = oyear;

    if (month == 11) {
        year += 1;
        month = 1;
    } else {
        month  = omonth + 2;
    }

    return {
        start: new Date(`${oyear}-${omonth + 1}-${1} 0:0:0`),
        end: new Date(`${year}-${month}-${1} 0:0:0`)
    }
}

module.exports = {
    getDateRange: getDateRange
}
