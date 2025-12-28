export const REACT_QUESTIONS = [
    // --- NOVICE (Very Basic) ---
    {
        title: "React JS - Novice Level",
        category: "React.js",
        difficulty: "Novice",
        questions: 10,
        duration: "15 mins",
        type: "standard",
        questionsData: [
            {
                text: "What is React mainly used for?",
                options: ["Database management", "Building user interfaces", "Server-side routing", "Operating system development"],
                correctAnswer: "Building user interfaces",
                explanation: "React is a JavaScript library specifically designed for building interactive user interfaces (UIs) for web applications."
            },
            {
                text: "Which of the following is used to pass data to a component from outside?",
                options: ["setState", "render", "props", "PropTypes"],
                correctAnswer: "props",
                explanation: "Props (short for properties) are read-only inputs passed from a parent component to a child component to configure it."
            },
            {
                text: "What syntax extension does React use to describe UI elements?",
                options: ["XML", "JSX", "HTML", "Java"],
                correctAnswer: "JSX",
                explanation: "JSX (JavaScript XML) is a syntax extension that looks like HTML but allows writing JavaScript logic directly within it."
            },
            {
                text: "Which method is required in a class component?",
                options: ["render()", "return()", "componentDidMount()", "constructor()"],
                correctAnswer: "render()",
                explanation: "The render() method is the only required method in a class component; it returns the elements to be displayed."
            },
            {
                text: "How do you create a functional component in React?",
                options: ["class MyComponent extends React.Component", "function MyComponent()", "new Component()", "React.newComponent()"],
                correctAnswer: "function MyComponent()",
                explanation: "Functional components are simply JavaScript functions that return JSX."
            },
            {
                text: "What hook is used to manage state in a functional component?",
                options: ["useEffect", "useState", "useContext", "useReducer"],
                correctAnswer: "useState",
                explanation: "useState is the primary hook for adding state variables to functional components."
            },
            {
                text: "What wraps multiple elements returned from a component without adding an extra node to the DOM?",
                options: ["<div>", "<container>", "<React.Fragment>", "<section>"],
                correctAnswer: "<React.Fragment>",
                explanation: "React.Fragment (or the <>...</> shorthand) groups a list of children without adding extra nodes to the DOM."
            },
            {
                text: "How do you handle a click event in React?",
                options: ["onclick='handler()'", "onClick={handler}", "click={handler}", "on-click={handler}"],
                correctAnswer: "onClick={handler}",
                explanation: "React events use camelCase naming (onClick) and accept a function reference in curly braces."
            },
            {
                text: "What function outputs the React application to the DOM?",
                options: ["React.render()", "ReactDOM.createRoot().render()", "DOM.render()", "HTML.render()"],
                correctAnswer: "ReactDOM.createRoot().render()",
                explanation: "In modern React (v18+), ReactDOM.createRoot().render() is the standard way to mount the app to the DOM."
            },
            {
                text: "Correct way to call a component named 'Welcome'?",
                options: ["<Welcome />", "Welcome()", "<welcome>", "new Welcome"],
                correctAnswer: "<Welcome />",
                explanation: "React components are used like custom HTML tags, e.g., <Welcome />."
            }
        ]
    },

    // --- EASY (Simple but slightly tricky) ---
    {
        title: "React JS - Easy Level",
        category: "React.js",
        difficulty: "Easy",
        questions: 10,
        duration: "20 mins",
        type: "standard",
        questionsData: [
            {
                text: "What happens when you call setState?",
                options: ["The component is deleted", "The state updates immediately synchronous", "React schedules a re-render", "The DOM is wiped clean"],
                correctAnswer: "React schedules a re-render",
                explanation: "Calling setState triggers an update, scheduling a re-render of the component with the new state."
            },
            {
                text: "What is the second argument of the useEffect hook?",
                options: ["The cleanup function", "The dependency array", "The state object", "The callback function"],
                correctAnswer: "The dependency array",
                explanation: "The second argument is the dependency array, which determines when the effect should re-run."
            },
            {
                text: "Accessing children components is done using:",
                options: ["this.children", "props.children", "state.children", "React.children"],
                correctAnswer: "props.children",
                explanation: "props.children allows you to access the content passed between the opening and closing tags of a component."
            },
            {
                text: "Difference between state and props?",
                options: ["State is external, props are internal", "State is mutable, props are immutable", "State is for text, props are for numbers", "There is no difference"],
                correctAnswer: "State is mutable, props are immutable",
                explanation: "Props are read-only formatted data passed down, while state is managed internally and can be changed."
            },
            {
                text: "What is a 'key' prop used for in lists?",
                options: ["Styling the list item", "Identifying unique items for efficient updates", "Sorting the list", "Filtering the list"],
                correctAnswer: "Identifying unique items for efficient updates",
                explanation: "Keys help React identify which items have changed, added, or removed, optimizing re-renders."
            },
            {
                text: "How to conditionally render an element?",
                options: ["if-else inside JSX", "Ternary operator or logical &&", "switch-case inside attributes", "looping structures"],
                correctAnswer: "Ternary operator or logical &&",
                explanation: "Inside JSX, expressions like condition ? true : false or condition && result are standard for conditional rendering."
            },
            {
                text: "What is 'Lifting State Up'?",
                options: ["Moving state to a common ancestor", "Using Redux", "Moving state to the server", "Deleting state"],
                correctAnswer: "Moving state to a common ancestor",
                explanation: "Sharing state by moving it to the closest common parent of the components that need it."
            },
            {
                text: "What hook serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount?",
                options: ["useState", "useContext", "useEffect", "useReducer"],
                correctAnswer: "useEffect",
                explanation: "useEffect combines the logic of lifecycle methods for side effects in functional components."
            },
            {
                text: "Using a ref in React allows you to:",
                options: ["Change the state directly", "Access a DOM element directly", "Force a re-render", "Bind data two-ways"],
                correctAnswer: "Access a DOM element directly",
                explanation: "Refs provide a way to access DOM nodes or React elements created in the render method."
            },
            {
                text: "Default behavior of form submission in React?",
                options: ["Reloads the page", "Calls API automatically", "Validates inputs", "Clears the form"],
                correctAnswer: "Reloads the page",
                explanation: "Standard usage requires e.preventDefault() to stop the browser from reloading the page."
            }
        ]
    },

    // --- INTERMEDIATE (Moderate application) ---
    {
        title: "React JS - Intermediate Level",
        category: "React.js",
        difficulty: "Intermediate",
        questions: 10,
        duration: "30 mins",
        type: "standard",
        questionsData: [
            {
                text: "What is Context API used for?",
                options: ["Server-side rendering", "Preventing prop drilling", "Managing database connections", "Optimizing CSS"],
                correctAnswer: "Preventing prop drilling",
                explanation: "Context provides a way to pass data through the component tree without having to pass props down manually at every level."
            },
            {
                text: "What does useMemo do?",
                options: ["Memorizes a function definition", "Memorizes a computed value", "Triggers a side effect", "Manages state"],
                correctAnswer: "Memorizes a computed value",
                explanation: "useMemo caches the result of a calculation between re-renders to avoid expensive re-computations."
            },
            {
                text: "What is a Higher-Order Component (HOC)?",
                options: ["A component that returns another component", "A parent of all components", "A specialized hook", "A Redux store"],
                correctAnswer: "A component that returns another component",
                explanation: "An HOC is a function that takes a component and returns a new component, often used for reusing component logic."
            },
            {
                text: "What is the purpose of React.memo?",
                options: ["To cache state", "To prevent unnecessary re-renders of functional components", "To memorize API calls", "To create a reference"],
                correctAnswer: "To prevent unnecessary re-renders of functional components",
                explanation: "React.memo is a higher order component that skips re-rendering if the props have not changed."
            },
            {
                text: "How does React handle reconciliation?",
                options: ["By reloading the page", "By comparing the Virtual DOM with the real DOM", "By updating every element", "By using jQuery"],
                correctAnswer: "By comparing the Virtual DOM with the real DOM",
                explanation: "React updates the Virtual DOM, compares it with the previous snapshot (diffing), and updates only the changed parts in the real DOM."
            },
            {
                text: "What is the rule of hooks?",
                options: ["Call them inside loops", "Call them only at the top level", "Call them in class components", "Call them asynchronously"],
                correctAnswer: "Call them only at the top level",
                explanation: "Hooks must be called at the top level of a React function, not inside loops, conditions, or nested functions."
            },
            {
                text: "What is useReducer best for?",
                options: ["Fetching data", "Complex state logic involving sub-values", "Simple string updates", "Context creation"],
                correctAnswer: "Complex state logic involving sub-values",
                explanation: "useReducer is preferable to useState when state logic is complex or depends on previous state, similar to Redux."
            },
            {
                text: "What is a 'controlled component'?",
                options: ["Where DOM handles the form data", "Where React state handles the form data", "A component with no props", "A component using Ref"],
                correctAnswer: "Where React state handles the form data",
                explanation: "In a controlled component, form data is handled by a React component's state, making it the 'single source of truth'."
            },
            {
                text: "Why can't you update state directly (this.state.x = 5)?",
                options: ["It throws an error", "It overwrites the object", "It won't trigger a re-render", "It is illegal in JS"],
                correctAnswer: "It won't trigger a re-render",
                explanation: "Direct mutation doesn't alert React to changes, so the UI won't update. setState or the setter from useState must be used."
            },
            {
                text: "What is the Portal in React used for?",
                options: ["Routing", "Authentication", "Rendering children into a DOM node outside the parent hierarchy", "Server Side Rendering"],
                correctAnswer: "Rendering children into a DOM node outside the parent hierarchy",
                explanation: "Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component (e.g., Modals)."
            }
        ]
    },

    // --- MASTER (Advanced Problem Solving) ---
    {
        title: "React JS - Master Level",
        category: "React.js",
        difficulty: "Master",
        questions: 10,
        duration: "45 mins",
        type: "standard",
        questionsData: [
            {
                text: "How does React Fiber improve performance?",
                options: ["By using multi-threading", "By splitting rendering work into chunks", "By compiling to assembly", "By removing the Virtual DOM"],
                correctAnswer: "By splitting rendering work into chunks",
                explanation: "React Fiber allows rendering tasks to be paused, aborted, or prioritized, enabling smoother animations and responsiveness."
            },
            {
                text: "What is the issue with 'Prop Drilling' and how to solving it efficiently?",
                options: ["Performance lag; solve with more props", "Verbose code; solve with Context or Composition", "Security risk; solve with encryption", "Memory leak; solve with refs"],
                correctAnswer: "Verbose code; solve with Context or Composition",
                explanation: "Prop drilling makes code hard to maintain. Context API or component composition are standard solutions."
            },
            {
                text: "Difference between useLayoutEffect and useEffect?",
                options: ["No difference", "useLayoutEffect fires synchronously after DOM mutations", "useEffect is for layout", "useLayoutEffect is slower"],
                correctAnswer: "useLayoutEffect fires synchronously after DOM mutations",
                explanation: "useLayoutEffect blocks the browser pain until it finishes, firing synchronously after all DOM mutations. useEffect fires asynchronously."
            },
            {
                text: "Custom Hooks must encforce which naming convention?",
                options: ["Must perform a side effect", "Must be a class", "Must start with 'use'", "Must return JSX"],
                correctAnswer: "Must start with 'use'",
                explanation: "React uses the 'use' prefix to automatically check for violations of the Rules of Hooks."
            },
            {
                text: "Optimizing a large list rendering in React?",
                options: ["Render all at once", "Use Virtualization (e.g., react-window)", "Use inline styles", "Use state for every item"],
                correctAnswer: "Use Virtualization (e.g., react-window)",
                explanation: "Virtualization renders only the items currently visible in the viewport, significantly improving performance for large lists."
            },
            {
                text: "What is 'strict mode' in React?",
                options: ["Enforces types like TypeScript", "Highlights potential problems in an application", "Prevents all errors", "Compiles code strictly"],
                correctAnswer: "Highlights potential problems in an application",
                explanation: "StrictMode is a tool for highlighting potential problems. It activates extra checks and warnings for its descendants."
            },
            {
                text: "How to handle error boundaries in functional components?",
                options: ["Use try-catch in useEffect", "They are not supported directly, use a class component wrapper", "Use useErrorBoundary hook", "Use Error.handle()"],
                correctAnswer: "They are not supported directly, use a class component wrapper",
                explanation: "Error Boundaries (getDerivedStateFromError, componentDidCatch) currently must be class components. There is no hook yet."
            },
            {
                text: "Code Splitting is best achieved using?",
                options: ["React.split()", "React.lazy and Suspense", "Webpack only", "JSON splitting"],
                correctAnswer: "React.lazy and Suspense",
                explanation: "React.lazy() helps render a dynamic import as a regular component, and Suspense shows a fallback while loading."
            },
            {
                text: "What causes a memory leak in useEffect?",
                options: ["Too many variables", "Performing updates on an unmounted component", "Using console.log", "Empty dependency array"],
                correctAnswer: "Performing updates on an unmounted component",
                explanation: "Attempting to update state on a component that has already unmounted (e.g. after an async fetch) causes leaks. Cleanup functions prevent this."
            },
            {
                text: "Concurrent Mode in React allows?",
                options: ["Running two React apps", "Rendering multiple versions of the UI at the same time", "Multi-threaded JS", "Faster compiling"],
                correctAnswer: "Rendering multiple versions of the UI at the same time",
                explanation: "It allows React to interrupt a render to handle a high-priority event, improving perceived performance."
            }
        ]
    },

    // --- EXPERT (Real-world / Architecture) ---
    {
        title: "React JS - Expert Level",
        category: "React.js",
        difficulty: "Expert",
        questions: 10,
        duration: "60 mins",
        type: "standard",
        questionsData: [
            {
                text: "In Micro-Frontend architecture, how can React apps communicate efficiently?",
                options: ["Global Variables", "Custom Events / PubSub", "Directly calling functions", "They cannot communicate"],
                correctAnswer: "Custom Events / PubSub",
                explanation: "Decoupled communication using Custom Events or a Publish/Subscribe system is standard for micro-frontends to remain independent."
            },
            {
                text: "Server Side Rendering (SSR) vs Static Site Generation (SSG) in Next.js?",
                options: ["SSR builds at runtime per request, SSG builds at build time", "SSG is slower than SSR", "SSR is only for static pages", "No difference"],
                correctAnswer: "SSR builds at runtime per request, SSG builds at build time",
                explanation: "SSG pre-renders at build time (fast, cached). SSR renders on each request (dynamic data, slower TTFB)."
            },
            {
                text: "How to prevent 'Zombie Children' in Redux state management?",
                options: ["Delete children manually", "Ensure mapStateToProps is consistent and selectors are stable", "Do not use Redux", "Use zombie mode"],
                correctAnswer: "Ensure mapStateToProps is consistent and selectors are stable",
                explanation: "Zombie children occur when a child component reads from store state that is derived from props that are effectively 'stale' or inconsistent during updates."
            },
            {
                text: "What is the hydration process?",
                options: ["Adding water to code", "Attaching event listeners to HTML rendered by the server", "Downloading JSON", "Compiling JSX"],
                correctAnswer: "Attaching event listeners to HTML rendered by the server",
                explanation: "Hydration is the process of using client-side JavaScript to add application state and interactivity to server-rendered HTML."
            },
            {
                text: "Optimistic UI updates strategy involves?",
                options: ["Updating the UI before the server confirms the action", "Waiting for server response", "Using optimistic locking", "Hoping for the best"],
                correctAnswer: "Updating the UI before the server confirms the action",
                explanation: "The UI is updated immediately to feel responsive, and reverted if the server request fails."
            },
            {
                text: "The 'tearing' problem in UI refers to?",
                options: ["CSS breaking", "Visual inconsistencies due to mismatched states during concurrent rendering", "HTML parsing errors", "Components unmounting"],
                correctAnswer: "Visual inconsistencies due to mismatched states during concurrent rendering",
                explanation: "Tearing happens if the UI shows values from two different states (e.g. start of render vs end of render) during an interruptible render."
            },
            {
                text: "Implementing a custom middleware in Redux requires a function with signature:",
                options: ["store => next => action", "action => next => store", "next => store => action", "state => action"],
                correctAnswer: "store => next => action",
                explanation: "Redux middleware is a curried function: const middleware = store => next => action => { ... }"
            },
            {
                text: "Why is immutability crucial for complex state React apps?",
                options: ["It saves memory", "It enables fast reference equality checks (shallow compare) for performance", "It makes code shorter", "React requires it"],
                correctAnswer: "It enables fast reference equality checks (shallow compare) for performance",
                explanation: "Checking reference equality (oldObject === newObject) is much faster than deep comparison, enabling efficient shouldComponentUpdate/React.memo checks."
            },
            {
                text: "Handling Race Conditions in useEffect data fetching?",
                options: ["Use setTimeout", "Use a boolean flag or AbortController to ignore stale responses", "React handles it automatically", "Use useRace hook"],
                correctAnswer: "Use a boolean flag or AbortController to ignore stale responses",
                explanation: "If a component re-renders or unmounts before fetch completes, the callback should ignore the result. AbortController is the modern way."
            },
            {
                text: "Best pattern for sharing logic across components in 2024?",
                options: ["Mixins", "Inheritance", "Custom Hooks", "Global Scope"],
                correctAnswer: "Custom Hooks",
                explanation: "Custom Hooks allow you to extract component logic into reusable functions, replacing older patterns like Mixins and HOCs."
            }
        ]
    }
];
