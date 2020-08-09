const getDate = () => {
    let date = new Date()

    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDay()

    const registerDay = `${year}-${month}-${day}`

    return registerDay
}

module.exports = {
    getDate
}
