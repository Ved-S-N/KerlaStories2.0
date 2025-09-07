# TODO: Add Chat History Sidebar

## Backend Changes

- [ ] Update ChatMessage model to include sessionId
- [ ] Modify POST /chat to handle sessionId (generate if missing)
- [ ] Add GET /sessions/:userId endpoint
- [ ] Update GET /history/:userId to support sessionId filter

## Frontend Changes

- [ ] Add state for currentSessionId and sessions list
- [ ] Fetch sessions on component mount
- [ ] Create sidebar component for session history
- [ ] Handle session click to load messages
- [ ] Include sessionId in message sends
- [ ] Adjust layout for sidebar (grid layout)
- [ ] Preserve existing functionality (speech, language, etc.)

## Testing

- [ ] Test backend endpoints
- [ ] Test frontend UI and interactions
- [ ] Ensure no regressions
