async function checkDateFormat(date){
    const regex = /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (regex.test(date)) {
        return true;
    } else {
        return false;
    }
}

module.exports = checkDateFormat;