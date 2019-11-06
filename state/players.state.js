import { getAllUsers } from "../api/users.api";

const ACTIONS = {
  LOAD_ALL_PLAYERS: 'load-all-players'
}

export const playerList = (state = [], action = {}) => {
  switch(action.type){
    case ACTIONS.LOAD_ALL_PLAYERS:
      return action.playerList
    default:
      return state
  }
}

export const playerLookup = (state = {}, action = {}) => {
  switch(action.type){
    case ACTIONS.LOAD_ALL_PLAYERS:
      return action.playerLookup;
    default:
      return state
  }
}

export const loadAllPlayers = () => async dispatch => {
  await getAllUsers().then(players => {
    dispatch({
      type: ACTIONS.LOAD_ALL_PLAYERS,
      playerList: players.list,
      playerLookup: players.lookup
    })
  })
}