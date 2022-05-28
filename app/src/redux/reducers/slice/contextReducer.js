import * as types from '../../constants/actionTypes';

const initialState = {
  allContext: [
    {
      name: 'MainContext1',
      values: [
        { key: 'testKey1', value: 'testValue1' },
        { key: 'testKey2', value: 'testValue2' }
      ]
    },
    {
      name: 'MainContext3',
      values: [
        { key: 'testKey3', value: 'testValue3' },
        { key: 'testKey33', value: 'testValue33' }
      ]
    }
  ]
};

const contextReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_CONTEXT:
      const newContext = {
        name: action.payload.name.trim(),
        values: []
      };

      return {
        ...state,
        allContext: [...state.allContext, newContext]
      };

    case types.ADD_CONTEXT_VALUES:
      // console.log('payload is', action.payload);

      const newAllContext = [...state.allContext];

      for (let i = 0; i < newAllContext.length; i += 1) {
        if (newAllContext[i].name === action.payload.name) {
          newAllContext[i].values.push({
            key: action.payload.inputKey,
            value: action.payload.inputValue
          });
        }
      }

      return {
        ...state,
        allContext: newAllContext
      };
    default: {
      return state;
    }
  }
};

export default contextReducer;
