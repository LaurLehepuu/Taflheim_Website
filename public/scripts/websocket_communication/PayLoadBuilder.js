export class PayLoadBuilder {
    static ready(client_id, game_id) {
        return {
            method: "ready",
            client_id,
            game_id
        };
    }

    static create(client_id, initial_board, length){
        return{
            method: "create",
            client_id,
            board: initial_board,
            length
        }
    }

    static join(client_id, game_id) {
        return {
            method: "join",
            client_id,
            game_id
        }
    }

    static move(client_id, game_id, start_pos, end_pos) {
        return {
            method: 'move',
            client_id,
            game_id,
            move_from: start_pos,
            move_to: end_pos,
        }
    }

}
