function ecoData(message){
    const data = {
        userID: message.user.id,
        eris: 1024,
        yen: 512,
        daily: 0,
        weekly: 0,
        monthly: 0,
        work: 0,
        fish: 0
    }
    return data;
}

export default { ecoData }