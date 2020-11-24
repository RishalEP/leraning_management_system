const formResponse = (status_code,status_message,data) => {

    return({
        status_code : status_code,
        status_message : status_message,
        data : data
    })

}

module.exports = {formResponse}