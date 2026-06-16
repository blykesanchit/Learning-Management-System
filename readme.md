# Learning Management System (LMS)

## 1. Reset Password Flow

```js
// FOR RESET PASSWORD STEPS IN THIS PROJECT
// since we are creating 3 pages and each page will deal wth sensitive info, for resetting password

// step1- enter email, we send otp n put same otp on db of user and also its expiration time

// step2- a new request comes in with otp and mail address to reset otp,
// we verify with db otp and expire time,
// if yes we put otpVerified and send a success to client,

// step3 - now a new request comes in with emailaddress,
// new password,
// we check if otpVerified is true or not,
// if yes(optional but if expires for this is not yet there or not)- then we reset password
```

---

## 2. Multer + Cloudinary

```js
multer - take image, store into local storage

cloudinary - take image from local(public folder) to cloudinary
```

Multer and Cloudinary are frequently used together in Node.js applications to handle file uploads, particularly for images and videos.

- **Multer** is a Node.js middleware for handling `multipart/form-data`, primarily used for uploading files.
- It processes incoming requests that contain file data.
- Multer can temporarily store files on disk or in memory before they are further processed.

- **Cloudinary** is a cloud-based service specializing in image and video management.
- It offers storage, manipulation, optimization, and delivery of media assets.
- By offloading media handling to Cloudinary, developers can reduce server load and leverage its powerful features for transformations and CDN delivery.

In config folder:

```js
uploadToCloudinary(filePath);
```

---

## 3. Redux Authentication

```js
REDUX AUTHENTICATION IN STORING USERDATA AS STATE
AND FETCHING LOGIC IS KEPT AT TOP OF App.jsx
```

### Problem

I'm making my MERN app with authentication.

I'm using React Redux.

Sometimes when I'm in my `/editprofile` page and I reload, I go directly to `/login`.

Its due to the fact that in my `App.jsx` I have put protected routes, hence protecting the routes.

So it doesn't allow me to go to editprofile or myprofile page or anything that's protected.

I see my Redux in browser tools tab and instead of `setUserData` reducer being called and setting the userData for my user I see loading state.

When I change my link at top to `/`, then I see that I'm logged in and `setUserData` reducer runs and everything works well.

### Reason

Redux store lives in memory.

When page reloads:

```text
Redux store resets
↓
userData becomes null
↓
Protected Route runs first
↓
Navigate("/login")
```

The `getCurrentUser()` request hasn't completed yet.

That's why:

- Visiting `/` works because user data gets fetched first.
- Reloading `/editprofile` redirects to login because Redux state starts empty.

---

## 4. File Preview Before Upload

To select file and show that same file in the frontend we take **2 states**:

### Frontend State

Contains URL/path of image.

Used to display preview on frontend.

### Backend State

Contains actual file object.

Used for uploading to backend/cloudinary.

---

## 5. Scroll To Top

Scroll to top is just a `useEffect` in `App.jsx` that does:

```js
window.scrollTo(0, 0);
```

when `pathname` changes using `useLocation()`.

---

## 6. Admin Graphs

Using **Recharts** to draw admin graphs.

7. 

# React Deep Dive: Hooks, Custom Hooks, `useCallback`, Effects, and Infinite Remount Loops

## 1. Hooks Can Only Be Called During Render

React hooks must be called:

* At the top level of a React component
* Inside another custom hook

Valid:

```jsx
function Component() {
    const user = useGetCurrentUser();
}
```

Invalid:

```jsx
const handleClick = () => {
    useGetCurrentUser(); // ❌
};
```

### Why?

React internally tracks hooks by their order:

```jsx
useState();   // Hook #1
useEffect();  // Hook #2
useState();   // Hook #3
```

React expects this exact order on every render.

Calling hooks conditionally or inside event handlers breaks this order.

---

## 2. Hooks vs Functions Returned by Hooks

A hook itself:

```jsx
useGetCurrentUser();
```

must run during render.

But if the hook returns a function:

```jsx
const refreshCurrentUser = useGetCurrentUser();

await refreshCurrentUser();
```

that returned function can be called anywhere:

* button clicks
* API callbacks
* payment success handlers

Important distinction:

```text
Hook ≠ Function returned by hook
```

---

## 3. Returning a Function vs Calling a Function

Returning the function:

```jsx
return fetchUser;
```

Usage:

```jsx
const fetchUser = useGetCurrentUser();

await fetchUser();
```

Returning the result:

```jsx
return fetchUser();
```

This executes immediately.

If async:

```jsx
return Promise;
```

Then:

```jsx
const x = useGetCurrentUser();

x(); // ❌ TypeError
```

because `x` is now a Promise, not a function.

---

## 4. What is `useCallback`?

Without `useCallback`:

```jsx
const fetchUser = () => {};
```

Every render creates a new function:

```text
Render 1 → Function A
Render 2 → Function B
Render 3 → Function C
```

JavaScript compares references:

```jsx
Function A === Function B // false
```

With `useCallback`:

```jsx
const fetchUser = useCallback(() => {}, []);
```

React returns the same function reference:

```text
Render 1 → Function A
Render 2 → Function A
Render 3 → Function A
```

### Important:

`useCallback` does NOT make functions faster.

Its primary purpose is:

```text
Preserve function identity across renders.
```

---

## 5. Why Put `fetchUser` in `useEffect` Dependencies?

Example:

```jsx
useEffect(() => {
    fetchUser();
}, [fetchUser]);
```

React's rule:

> Every external value used inside an effect should appear in the dependency array.

Since the effect uses:

```jsx
fetchUser();
```

React expects:

```jsx
[fetchUser]
```

---

## 6. Why `useCallback` Was Needed Here

Without:

```jsx
const fetchUser = async () => {};
```

each render creates a new function:

```text
oldFetchUser !== newFetchUser
```

React thinks the dependency changed:

```jsx
useEffect(() => {
    fetchUser();
}, [fetchUser]);
```

which can cause:

```text
render
→ new function
→ effect
→ state update
→ render
→ new function
→ effect
→ ...
```

potentially creating infinite loops.

Using:

```jsx
const fetchUser = useCallback(async () => {
    ...
}, []);
```

stabilizes the function reference.

---

## 7. Browser Refresh vs Rerender vs Remount

### Rerender

Triggered by:

```jsx
setState(...)
dispatch(...)
```

Component function runs again.

Effects with:

```jsx
useEffect(..., [])
```

do NOT rerun.

---

### Browser Refresh (F5)

Entire React app is destroyed:

```text
Old app destroyed
↓
New app created
↓
Effects run again
```

---

### Remount

Occurs when a parent stops rendering a component:

```text
Unmount child
↓
Mount child again
↓
Effects run again
```

---

## 8. Custom Hook Pattern Used

Hook:

```jsx
const fetchUser = useCallback(async () => {
    dispatch(setLoading(true));

    const result = await axios.get(...);

    dispatch(setUserData(result.data.user));

    dispatch(setLoading(false));
}, []);

useEffect(() => {
    fetchUser();
}, [fetchUser]);

return fetchUser;
```

Usage:

```jsx
const refreshCurrentUser = useGetCurrentUser();

await refreshCurrentUser();
```

This is a valid and common pattern:

* Auto-fetch on mount
* Manual refetch later

---

# Debugging Journey

## Problem

Console output repeatedly showed:

```text
11
2
22
3
5
11
2
22
3
5
```

meaning:

```text
useEffect kept running repeatedly.
```

---

## Mount/Unmount Investigation

Added:

```jsx
useEffect(() => {
    console.log("mounted");

    return () => {
        console.log("unmounted");
    };
}, []);
```

Output:

```text
mounted
unmounted
mounted
unmounted
```

This proved:

```text
The component was remounting repeatedly.
```

Not merely rerendering.

---

# Root Cause: Global App Loading

## App.jsx

```jsx
const { loading } = useSelector(state => state.user);

if (loading) {
    return <Loading />;
}

return <Routes />;
```

## Hook

```jsx
dispatch(setLoading(true));
...
dispatch(setLoading(false));
```

Execution flow:

```text
App renders Routes
↓
ViewCourse mounts
↓
useEffect runs
↓
setLoading(true)
↓
App renders Loading
↓
Routes disappear
↓
ViewCourse unmounts
↓
API finishes
↓
setLoading(false)
↓
Routes return
↓
ViewCourse mounts again
↓
useEffect runs again
```

Infinite loop.

---

# Why ViewCourse's Loading Was Fine

Inside `ViewCourse`:

```jsx
{loading ? <Loading /> : <Content />}
```

This only changes the rendered JSX.

The component itself stays mounted.

But:

```jsx
if (loading) {
    return <Loading />;
}
```

in `App.jsx` removes the entire application tree.

---

# Better Solution

Instead of replacing the app:

```jsx
return (
    <>
        <Routes />
        {loading && <Loading />}
    </>
);
```

or use a loading overlay.

This keeps routes mounted.

---

# Redux Loading State Design

Having separate loading states per slice is GOOD:

```jsx
user.loading
course.loading
lecture.loading
review.loading
```

Even better:

```jsx
user.initialLoading
user.fetchingCurrentUser

course.fetchingCourses
course.creatingCourse

review.submittingReview
```

Specific names scale better than generic `loading`.

---

# Key React Principles Learned

```text
State update
↓
Rerender
```

```text
Parent changes rendered tree
↓
Unmount child
↓
Mount child
```

```text
Browser refresh
↓
Destroy app
↓
Create app again
```

These are three completely different events.

---

# Common React Bug Discovered

```text
Global loading state
+
Conditional route rendering
=
Accidental remount loops
```

This is one of the most common bugs in React applications.
