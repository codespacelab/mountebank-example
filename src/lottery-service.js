const mbHelper = require('./mountebank-helper');
const settings = require('./settings');

const addService = () => {
    const stubs = [{
        predicates: [{
            and: [
                {
                    exists: {
                        query: {
                            "lotteryTicket": true
                        }
                    }
                },
                {
                    equals: {
                        path: "/v1/validate",
                        method: "GET"
                    }
                }
            ]
        }],
        responses: [{
            is: {
                statusCode: 200,
                headers: {
                    "Consent-Type": "application/json"
                }
            },
            _behaviors: {
                decorate: `(config) => {
                    const ticketNumber = config.request.query['lotteryTicket'];
                    let isWinningTicket = false;
                    let prize = '20 euros';

                    if (ticketNumber) {
                        if (ticketNumber.match('50')) {
                            isWinningTicket = true;
                            prize = '50 euros';
                        } else if (ticketNumber.match('100')) {
                            isWinningTicket = true;
                            prize = '100 000 euros';
                        } else if (ticketNumber.match('car')) {
                            isWinningTicket = true;
                            prize = 'New car';
                        } else {
                            isWinningTicket = false;
                        }

                        config.response.body = { 
                            isWinningTicket: isWinningTicket,
                            prize: isWinningTicket ? prize : "Sorry try again"
                         };
                    } else {
                        config.response.body = { error: "Invalid lottery ticket" };
                        config.response.statusCode = 400;
                    }
                }`
            }
        }]
    }];

    const imposter = {
        port: settings.lottery_service,
        protocol: 'http',
        stubs: stubs
    };

    return mbHelper.postImposter(imposter);
}

module.exports = { addService };