import axios from "axios";

const alpacaBaseUrl = `https://broker-api.sandbox.alpaca.markets/v1`;
const alpacaUsername = "CK583P32VCT0I481P4I2";
const alpacaPassword = "oID00PheL4Gy38X519nIxJ9jQq7DhILwTCktHYVo";

const alpacaPaperAccBaseUrl = `https://paper-api.alpaca.markets/v2`;
const alpacaPaperAccUsername = "PK5WSGFGWR644GFAK2XK";
const alpacaPaperAccPassword = "ps1vadEfOzLnZWyrRFR7lLZK2zfapmAluMAKUvIg";

const IBBaseUrl = `http://localhost/v1`;
const IBProductList = `https://www.interactivebrokers.com/webrest/search/products-by-filters`;
const IBAccountId = "DU9313757";

// export const fetchAssetsList = () => {
//     return new Promise((resolve, reject) => {
//         let config = {
//             method: 'get',
//             maxBodyLength: Infinity,
//             url: `${alpacaBaseUrl}/assets`,
//             headers: {
//                 Accept: 'application/json',
//             },
//             auth: {
//                 username: alpacaUsername,
//                 password: alpacaPassword
//             }
//         };

//         axios.request(config)
//             .then((response) => {
//                 resolve(response?.data || []);
//             })
//             .catch((error) => {
//                 reject(error);
//             });
//     })
// }

// export const fetchPaperAccAssetsList = () => {
//     return new Promise((resolve, reject) => {
//         let config = {
//             method: 'get',
//             maxBodyLength: Infinity,
//             url: `${alpacaPaperAccBaseUrl}/assets`,
//             headers: {
//                 "Accept": 'application/json',
//                 "APCA-API-KEY-ID": alpacaPaperAccUsername,
//                 "APCA-API-SECRET-KEY": alpacaPaperAccPassword
//             }
//         };

//         axios.request(config)
//             .then((response) => {
//                 resolve(response?.data || []);
//             })
//             .catch((error) => {
//                 reject(error);
//             });
//     })
// }

export const fetchAccountDetail = () => {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `${alpacaPaperAccBaseUrl}/account`,
            headers: {
                "Accept": 'application/json',
                "APCA-API-KEY-ID": alpacaPaperAccUsername,
                "APCA-API-SECRET-KEY": alpacaPaperAccPassword
            }
        };

        axios.request(config)
            .then((response) => {
                resolve(response?.data || []);
            })
            .catch((error) => {
                reject(error);
            });
    })
}


export const fetchIBAuthStatus = () => {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `${IBBaseUrl}/api/iserver/auth/status`,
            headers: {
                "Accept": 'application/json',
            }
        };

        axios.request(config)
            .then((response) => {
                resolve(response?.data || []);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export const fetchIBPortfolioAccounts = () => {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `${IBBaseUrl}/api/portfolio/accounts`,
            headers: {
                "Accept": 'application/json',
            }
        };

        axios.request(config)
            .then((response) => {
                resolve(response?.data || []);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export const fetchIBPortfolioSummary = (id = IBAccountId) => {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `${IBBaseUrl}/api/portfolio/${id}/summary`,
            headers: {
                "Accept": 'application/json',
            }
        };

        axios.request(config)
            .then((response) => {
                resolve(response?.data || []);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export const fetchIBStockList = (payload) => {
    return new Promise((resolve, reject) => {

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost/webrest/search/products-by-filters',
            headers: {
                'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                // 'Cookie': 'iab=1',
                // "Access-Control-Allow-Origin": "*",
                // "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                // "Access-Control-Allow-Headers": "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range",
                // "Access-Control-Expose-Headers": "Content-Length,Content-Range",

            },
            data: payload
        };

        axios.request(config)
            .then((response) => {
                resolve(response?.data || []);
            })
            .catch((error) => {
                reject(error);
            });
    });
}


