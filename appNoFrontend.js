//this file can run from node
const { createStore, applyMiddleware } = require('redux');

const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  return result;
};

const defaultState = { courses: [
    { name: 'Bio 101', topic: 'Science' },
    { name: 'Light & Sound', topic: 'Physics' },
    { name: 'CS 124', topic: 'Computer Science' }
]};

function reducer(state, action) {
  switch (action.type) {
  case 'ADD_COURSE':
    return Object.assign({}, state, {
      courses: [...state.courses, action.course]
    });
  case 'REMOVE_LAST_COURSE':
    return Object.assign({}, state, {
      courses: [...state.courses.slice(0, -1)]
    });
  default:
    return state;
  }
}

const store = createStore(reducer, defaultState, applyMiddleware(logger));

function addView(viewFunc) {
  viewFunc(store.getState());

  store.subscribe(() => {
    console.log('subscribed function called');
    viewFunc(store.getState());
  });
}

addView((state) => {
  console.log(`There are ${state.courses.length} courses in the library`);
});

addView((state) => {
  console.log(`The latest course in the library: ${state.courses[state.courses.length -1].name}`);
});

store.dispatch({
  type: 'ADD_COURSE',
  course: { name: 'This is the new course', topic: 'Really does not matter' }
});

store.dispatch({
  type: 'ADD_COURSE',
  course: { name: 'Oops tpo ono', topic: 'Lets say delete this' }
});

store.dispatch({ type: 'REMOVE_LAST_COURSE' });
