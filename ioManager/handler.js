function makeHandleEvent(client, clientManager, roomManager) {
    function ensureExists(getter, rejectionMessage) {
        return new Promise(function (resolve, reject) {

            const res = getter()
            return res ? resolve(res) : reject(rejectionMessage)
        })
    }
    // function ensureClient(clientId) {
    //     return ensureExists(
    //         () => clientManager.getClientById(clinetId),
    //         'client not exists.'
    //     )
    // }

    function checkRoom(roomId) {
        return ensureExists(
            () => roomManager.getRoomById(roomId),
            `invalid room: ' ${roomId}`
        )
    }

    // function ensureValidRoom(roomId) {
    //     return Promise.all(
    //         checkRoom(roomId)
    //         // ,ensureClient(client.id)
    //     ).then(([room]) => Promise.resolve({ room }));
    // }

    function handleEvent(roomId
        // , createEntry
    ) {
        return checkRoom(roomId)
            .then(function (room) {
                return room;
            })
    }

    return handleEvent
}



module.exports = function (client, clientManager, roomManager) {
    const handleEvent = makeHandleEvent(client, clientManager, roomManager);

    function handleRegister(idUser, callback) {
        clientManager.registerClient(client, idUser);
        return callback(client.id);

    }

    function handleFind(idUser, callback) {
        var findRoom = roomManager.findRoomCanJoin();
        var _client = clientManager.getClientById(client.id);

        if (findRoom != -1) {
            handleEvent(findRoom).then(room => {
                room.joinRoom(_client);
            }).catch((err) => {
                if (err) {
                    client.emit('leave', 'Trận không còn tồn tại.Vui lòng tìm trận mới.')
                }
            })
        } else {
            var roomId = roomManager.registerRoom(_client);
            return callback({ isRegister: true, data: roomId });
        }
    }

    function handleTurn({ move, room } = {}) {
        handleEvent(room).then(_room => {
            _room.handleTurn(move, client.id);
        }).catch((err) => {
            if (err) {
                client.emit('leave', 'Trận không còn tồn tại.Vui lòng tìm trận mới.')
            }
        })
    }


    function handleUndo({ stepUndo, room } = {}) {
        handleEvent(room).then(_room => {
            _room.handleUndo(stepUndo, client.id);
        }).catch((err) => {
            if (err) {
                client.emit('leave', 'Trận không còn tồn tại.Vui lòng tìm trận mới.')
            }
        })
    }

    function handleUndoAccept({ flat, undoStep, room } = {},callback) {
        handleEvent(room).then(_room => {
            _room.handleUndoAccept(flat, undoStep, client.id)
            return callback(null)
        }).catch((err) => {
            if (err) {
                client.emit('leave', 'Trận không còn tồn tại.Vui lòng tìm trận mới.')
            }
        })
    }

    function handleTie(room) {
        handleEvent(room).then(_room => {
            _room.handleTie(client.id)
        }).catch((err) => {
            if (err) {
                client.emit('leave', 'Trận không còn tồn tại.Vui lòng tìm trận mới.')
            }
        })
    }

    function handleTieAccept({ flat, room }={}) {
        handleEvent(room).then(_room => {
            _room.handleTieAccept(flat,client.id)
        }).catch((err) => {
            if (err) {
                client.emit('leave', 'Trận không còn tồn tại.Vui lòng tìm trận mới.')
            }
        })
    }

    function handleGiveUp(room) {
        handleEvent(room).then(_room => {
            _room.handleGiveUp(client.id)
        })
    }

    function handleLeave(room) {
        // var createEntry = () => ({ event: `left room ${roomId}` })
        handleEvent(room)
            .then(function (_room) {
                console.log('leave')
                roomManager.deleteRoom(room.id)
            }).catch((err) => {
                if (err) {
                    client.emit('leave', 'Trận không còn tồn tại.Vui lòng tìm trận mới.')
                }
            })
    }

    // function handleMessage({ roomId, message } = {}, callback) {
    //     const createEntry = () => ({ message })

    //     handleEvent(roomId, createEntry)
    //         .then(() => callback(null))
    //         .catch(callback)
    // }

    function handleDisconnect(roomId) {
        // remove user client
        clientManager.removeClient(client)

        // delete user's room
        roomManager.removeRoom(roomId)
    }

    function handleNewGame(roomId,callback){
        handleEvent(room).then(_room => {
            _room.newGame(clientId)
        }).catch((err) => {
            if (err) {
                client.emit('leave', 'Trận không còn tồn tại.Vui lòng tìm trận mới.')
            }
        })
    }
    return {
        handleRegister,
        handleFind,
        handleTurn,
        handleUndo,
        handleUndoAccept,
        handleTie,
        handleTieAccept,
        handleLeave,
        handleGiveUp,
        handleNewGame,
        // handleMessage,
        handleDisconnect
    }
}