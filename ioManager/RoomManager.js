
class Room {
    constructor(client) {
        this.id = client.client.id;
        this.host = client; // { client, user: {id,username,avatar} }
        this.mem = null;
        this.isAvailable = true;
        // this.chatHistory = [];
        // this.playHistory = [];
    }
    broadcastMessage(message, clientId) {
        this.members.forEach(m => { m.emit('message', message) })
    }

    handleTurn(move, clientId) {
        if (this.host.client.id === clientId) {
            this.mem.client.emit('turnPlayed', move)
        } else {
            this.host.client.emit('turnPlayed', move)
        }
    }

    handleUndo(stepUndo,clientId){
        if (this.host.client.id === clientId) {
            this.mem.client.emit('undo-alert', stepUndo)
        } else {
            this.host.client.emit('undo-alert', stepUndo)
        }
    }

    handleUndoAccept(flat,undoStep,clientId){
        if (this.host.client.id === clientId) {
            this.mem.client.emit('undo-accept', {flat,undoStep})
        } else {
            this.host.client.emit('undo-accept', {flat,undoStep})
        }
    }

    handleTie(clientId){
        if (this.host.client.id === clientId) {
            this.mem.client.emit('tie-alert')
        } else {
            this.host.client.emit('tie-alert')
        }
    }

    handleTieAccept(flat,clientId){
        if (this.host.client.id === clientId) {
            this.mem.client.emit('tie-accept', flat)
        } else {
            this.host.client.emit('tie-accept', flat)
        }
    }

    handleGiveUp(clientId){
        if (this.host.client.id === clientId) {
            this.mem.client.emit('give-up', false)
        } else {
            this.host.client.emit('give-up', false)
        }
    }

    alertLeave(clientId){
        if (this.host.client.id === clientId) {
            this.mem.client.emit('leave','Đối thủ đã thoát.Vui lòng tìm trận mới.')
        } else {
            this.host.client.emit('leave','Đối thủ đã thoát.Vui lòng tìm trận mới.')
        }
    }

    joinRoom(clientInfor) {
        // var clientInfor = this.ClientManager.getClientById(client.id);
        this.mem = clientInfor;
        this.isAvailable = false;

        var data = {
            player1: this.host.user,
            player2: this.mem.user,
            room: this.id,
        }

        this.host.client.emit('join', { data,isHost: true});
        this.mem.client.emit('join', { data,isHost: false});
    }

    // addEntry(entry) {
    //     this.chatHistory = this.chatHistory.concat(entry);
    // }

    // getChatHistory() {
    //     return this.chatHistory;
    // }

    checkAvailable() {
        return this.isAvailable;
    }
}

module.exports = function () {
    var roomQueue = new Map();

    function getRoomById(roomId) {
        var room = roomQueue.get(roomId);
        return room
    }

    function findRoomCanJoin() {
        for (var [key, room] of roomQueue) {
            if (room.checkAvailable()) {
                return key
            }
        }

        return -1;
    }
    function registerRoom(client) {
        var r = new Room(client);
        var id = client.client.id;
        roomQueue.set(id, r);
        return id;
    }

    function removeRoom(roomId) {
        var room = roomQueue.get(roomId)
        if (room) roomQueue.delete(roomId);
    }


    return {
        getRoomById,
        registerRoom,
        findRoomCanJoin,
        removeRoom
    }
}
