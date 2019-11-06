const _RoomManager =  require('./RoomManager')
var RoomManager = _RoomManager()

const _accountModel = require('../model/account.model')
var accountModel = _accountModel()

module.exports = function () {

    var clientsQueue = new Map();

    function registerClient(client, idUser) {
        accountModel.single(idUser).then(row => {
            var user = row[0];
            var { id, username, avatar } = user;
            clientsQueue.set(client.id, { client, user: { id, username, avatar } });
            return (null, client.id);
        }).catch(err => { return callback('error occurred') })
    }

    function removeClient(clientId) {
        clientsQueue.delete(clientId)
    }

    function getClientById(clientId) {
        return clientsQueue.get(clientId)
    }

    function matchPlayer(clientId) {
        const availableClient = null;

        for (let e of clientsQueue.values) {
            if (!e.isFindding) {
                findId = e.client.id;
                break;
            }
        }

        if (availableClient) {
            const reqClient = clientsQueue.get(clientId);

            var roomId = RoomManager.createRoom(reqClient, availableClient);

            availableClient.isFindding = false;
            availableClient.room = roomId;

            reqClient.isFindding = false;
            reqClient.room = roomId;

            clientsQueue.set(reqClient.client.id, reqClient);
            clientsQueue.set(availableClient.client.id, availableClient);
            return { roomId, opponent: availableClient.user.username };
        } else {
            const reqClient = clientsQueue.get(clientId);
            reqClient.isFindding = true;

            clientsQueue.set(reqClient.client.id, reqClient);
            return null;
        }

    }

    function leaveRoom(client, roomId) {
        RoomManager.removeRoom(roomId);
    }

    return {
        registerClient,
        removeClient,
        getClientById,
        matchPlayer,
        leaveRoom
    }
}