# Navbar Update Plan

## Tasks

- [x] Import useAuth from AuthContext and useNavigate from react-router-dom
- [x] Add state for dropdown open/close using useState
- [x] Add useEffect for event listener to close dropdown on outside clicks
- [x] Conditionally render user menu: Sign In button if not authenticated, avatar with dropdown if authenticated
- [x] Implement avatar circle with user initial using Tailwind classes
- [x] Implement dropdown menu with Profile, Dashboard, Sign Out options using Tailwind classes
- [x] Handle Sign Out: dispatch SIGN_OUT, clear local storage, redirect to /signin
- [x] Update mobile view to show avatar instead of Sign In if authenticated
- [x] Test the implementation for proper behavior
