import axios from "axios";

// const alpacaBaseUrl = `https://broker-api.sandbox.alpaca.markets/v1`;
// const alpacaUsername = "CK583P32VCT0I481P4I2";
// const alpacaPassword = "oID00PheL4Gy38X519nIxJ9jQq7DhILwTCktHYVo";

// const alpacaPaperAccBaseUrl = `https://paper-api.alpaca.markets/v2`;
// const alpacaPaperAccUsername = "PK5WSGFGWR644GFAK2XK";
// const alpacaPaperAccPassword = "ps1vadEfOzLnZWyrRFR7lLZK2zfapmAluMAKUvIg";

const IBAccountId = "DU9313757";
const IBBaseUrl = `http://122.176.139.248:8098/v1`; // http://122.176.139.248:8098/v1 http://localhost/v1
const NodeServBaseUrl = `http://localhost:4545`; // http://122.176.139.248:9011 http://localhost:4545

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

// export const fetchAccountDetail = () => {
//     return new Promise((resolve, reject) => {
//         let config = {
//             method: 'get',
//             url: `${alpacaPaperAccBaseUrl}/account`,
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


// export const fetchIBAuthStatus = () => {
//     return new Promise((resolve, reject) => {
//         let config = {
//             method: 'get',
//             url: `${IBBaseUrl}/api/iserver/auth/status`,
//             headers: {
//                 "Accept": 'application/json',
//             }
//         };

//         axios.request(config)
//             .then((response) => {
//                 resolve(response?.data || []);
//             })
//             .catch((error) => {
//                 reject(error);
//             });
//     });
// }

// export const fetchIBPortfolioAccounts = () => {
//     return new Promise((resolve, reject) => {
//         let config = {
//             method: 'get',
//             url: `${IBBaseUrl}/api/portfolio/accounts`,
//             headers: {
//                 "Accept": 'application/json',
//             }
//         };

//         axios.request(config)
//             .then((response) => {
//                 resolve(response?.data || []);
//             })
//             .catch((error) => {
//                 reject(error);
//             });
//     });
// }

export const fetchIBAccountDetail = () => {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `${IBBaseUrl}/api/iserver/accounts`,
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

export const fetchIBPortfolioSummary = (id) => {
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
            url: `${NodeServBaseUrl}/products-by-filters`,
            headers: {
                'Accept': 'application/json'
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

export const saveOrderResponseApi = (payload) => {
    return new Promise((resolve, reject) => {

        let config = {
            method: 'post',
            url: `${NodeServBaseUrl}/order-place`,
            headers: {
                'Accept': 'application/json'
            },
            data: payload
        };

        axios.request(config)
            .then((response) => {
                resolve(response?.data || {});
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export const fetchIBContractInfo = (conid) => {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `${IBBaseUrl}/api/iserver/contract/${conid}/info`,
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

export const fetchIBOpenOders = (filters) => {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `${IBBaseUrl}/api/iserver/account/orders${filters || ""}`,
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

export const fetchIBSnapshotApi = (conids, fields) => {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `${IBBaseUrl}/api/iserver/marketdata/snapshot?conids=${conids}&since=${Date.now()}&fields=${fields}`,
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

export const fetchIBPnlApi = (conids, fields) => {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `${IBBaseUrl}/api/iserver/account/pnl/partitioned`,
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

export const fetchPortfolioPositionApi = (accountId) => {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `${IBBaseUrl}/api/portfolio/${accountId}/positions/`,
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

export const orderPlaceApi = (accountId, payload) => {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'post',
            url: `${IBBaseUrl}/api/iserver/account/${accountId}/orders`,
            headers: {
                'Accept': 'application/json',
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

export const orderConfirmApi = (orderId, payload) => {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'post',
            url: `${IBBaseUrl}/api/iserver/reply/${orderId}`,
            headers: {
                'Accept': 'application/json',
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
