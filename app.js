/* global Redux */
const createStore = Redux.createStore;
const applyMiddleware = Redux.applyMiddleware;
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
  case 'REMOVE_COURSE':
    let courses = [...state.courses];
    courses.splice(action.index, 1);
    return Object.assign({}, state, {
      courses: courses
    });
  default:
    return state;
  }
}

// const store = createStore(reducer, defaultState, applyMiddleware(logger));
const store = createStore(reducer, defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

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
  let deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  let rows = state.courses
    .map((course, i) => {
      deleteBtn.setAttribute('onclick', `store.dispatch({type:"REMOVE_COURSE", index:${i}});`);
      return [course.name, course.topic, deleteBtn.outerHTML];
    });
  let table = document.querySelector('table-of-data');
  table.data = {
    headings: ['Name', 'Topic', ''],
    rows: rows
  };
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
