import { boardService } from "../services/board-service.js";

export default {
  state: {
    boards: [],
    board: null,
    filterBy: {
      name: '',
      tags: '',
      creator: '',
    },
  },
  getters: {
    boards(state) {
      return state.boards;
    },
    board(state) {
      return state.board;
    },
    activities(state) {
      return state.board.activities
    }
  },
  mutations: {
    setBoards(state, { boards }) {
      state.boards = boards;
    },
    setBoard(state, {board}) {
      state.board=board
    },
    deleteBoard(state, { id }) {
      const idx = state.boards.findIndex((t) => t._id === board._id);
      state.boards.splice(idx, 1);
    },
    updateBoard(state, { board }) {
      const idx = state.boards.findIndex((t) => t._id === board._id);
      state.boards.splice(idx, 0,board);
    },
    addBoard(state, { board }) {
      state.boards.unshift(board);
    },
    setFilterBy(state,{filterBy}){
      state.filterBy=filterBy
    }
  },
  actions: {
    async loadBoards({ commit,state }, { filterBy }) {
      try{
        const boards=await boardService.query(state.filterBy)
        commit({ type: "setBoards", boards });
        return boards
      }catch(err){
        console.log('Problem getting board ')
        throw err
      }
    },
    async getBoardById({commit},{id}){
      try{
        let board=await boardService.getById(id)
        commit({ type: "setBoard", board });
        return board
      }catch(err){
        console.log('Problem getting board ')
        throw err
      }
    },
    async deleteBoard({ commit }, { id }) {
      try{
        await boardService.deleteBoard(id)
        commit({ type: "deleteBoard", id });
      }catch(err){
        console.log('Problem Deleting board ')
        throw err
      }
    },
    async saveBoard({ commit }, { board }) {
      const type = board._id ? "updateBoard" : "addBoard";
      try{
        const savedBoard=await boardService.save(board)
        commit({ type, board:savedBoard });
      }catch(err){
        console.log('Problem Updating board id-',board._id)
        throw err
      }
    },
  },
};
