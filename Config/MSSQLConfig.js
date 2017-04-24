var MSdbconfig = {
    user: "sa",
    password: "Servion@123",
    server: "172.20.25.44",
    // You can use 'localhost\\instance' to connect to named instance     
    database: "PTDB1",
    pool: { max: 10, min: 1, idleTimeoutMillis: 30000 },
    // options: {
    //     encrypt: true
    // }
}
module.exports = MSdbconfig;