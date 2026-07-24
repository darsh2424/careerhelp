Summary Notes
----------------------
State, Props, Children, Components
1. useEffect()

useEffect(() => {
}, []);

Runs after the component is mounted.
The empty dependency array
[]

means
Execute once for this component's lifetime.

Perfect for
Reading localStorage
Initial authentication check
Opening WebSocket connections
Setting timers

-------------------------------
**react-router-dom**

1. Routes

Purpose
Acts as a container for all <Route> components. It matches the current URL and renders the best matching route.

Remember
Routes chooses which page to render.

2. Route
Purpose
Maps a URL path to a React component.

Example:
<Route path="/jobs" element={<Jobs />} />

3. Outlet

Purpose
Acts as a placeholder inside a layout where child routes are rendered.

Example(Design)
MainLayout
Navbar

<Outlet />

Footer

Explaination:
If URL changes to:/companies

only the Outlet content changes.
Navbar and Footer remain.


4. Link
Instead of
<a href="/jobs">

React Router provides
<Link to="/jobs">

Why?
Because <a> reloads the entire page.
<Link> performs client-side navigation, so only the React view changes while the application stays loaded.

5. useNavigate()
const navigate = useNavigate();
Summary

Programmatic navigation.

Instead of

<Link to="/login" />

the user clicks a button,

you decide in JavaScript where to go.

Perfect after

Login
Register
Logout
---------------------

**Context**
Library: react

1. createContext()

Purpose
Creates a global communication channel so data can be shared without passing props through every intermediate component.

const AuthContext = createContext();
Think of it as creating a shared room where components can read common values.

-> Context Provider
<AuthProvider>
    <App />
</AuthProvider>

The Provider makes the context values available to every component inside it.
Without a Provider, calling useContext(AuthContext) won't have the values you expect.

-- value
Whatever you pass inside

<AuthContext.Provider value={...}>
becomes globally available to components using useContext(AuthContext).

You can share:
values
functions
objects
arrays

There's no restriction.

-> useContext()

Hook: useContext(AuthContext)

Reads the current value from the nearest matching Provider.
const { user } = useAuth();

Important: 
If the Provider's value changes:
The Provider re-renders.
Components consuming that context receive the updated value.
Components that don't depend on that context generally don't need to update because of the context change.

when should state live in Context?

Ask yourself one question:
"Does multiple unrelated parts of my app need this value?"

If yes
→ Context
Examples:
Logged-in user
Theme
Language

If no
Keep it as local state to there pages.
Examples:
Login loading
Search textbox
Modal open
Password visibility

------------------------
**Redux/Toolkit**

1. createAsyncThunk()

Purpose
Creates an async Redux action.

Arguments
createAsyncThunk(
    actionName(i.e. auth/register),
    asyncFunction 
    (i.e. async(formData,thunkApi)=>{
        try{
        const res = await axiosClient.post("auth/register",formData)
        }catch(err){
            thunkApi.rejectWithValue(err.message)
        }
    })
)

Question
Why

"auth/register"
?

It is not a route.
It is simply an action identifier.

Redux DevTools later show:
auth/register/pending
auth/register/fulfilled
auth/register/rejected

Very useful while debugging.

2. createSlice()

Purpose

Creates:
reducer
actions

automatically.

Old Redux required:
Action Types
↓
Action Creator
↓
Reducer
↓
Switch Case

Toolkit combines all of this.

Example:
import { registerThunk } from "./authThunk"
const initialState = {
    loading:false,
    error:null
}
const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(registerThunk.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        builder.addCase(registerThunk.fulfilled,(state)=>{
            state.loading=false,
            state.error=null
        })
        builder.addCase(registerThunk.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})
export default authSlice.reducer

3. configureStore()

Purpose
Creates Redux Store.

Think:
Store
↓
All Slice Reducers
↓
Global Redux State

--> Three new hooks
4. useDispatch
const dispatch = useDispatch();

Summary
Returns Redux's dispatch() function.

Whenever you want to execute
thunk
action
you need this.

5. useSelecter
const { loading, error } = useSelector(state => state.auth);

Summary
Reads values from the Redux store.

Think of it as:
"Subscribe this component to these Redux values."

If loading changes,
only components using it re-render.


Important:
dispatch()
Executes an action or thunk.
Returns a Promise.
unwrap()
Removes Redux Toolkit's wrapper object.
Returns only the payload on success.
Throws the rejected value on failure.
Lets you use normal try...catch.

---------------------------
**react-hook-form with Yup**

For Each Form We Do:
Validation Schema
        ↓
useForm()
        ↓
Controlled UI
        ↓
handleSubmit()
        ↓
dispatch(thunk)
        ↓
loading / error
        ↓
Success Action (navigate / modal / toast)

