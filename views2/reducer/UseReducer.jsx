export const initialState = {
  isAuthenticated: false,
  user: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'USER':
      return { ...state, isAuthenticated: true, user: action.payload.user };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
};
