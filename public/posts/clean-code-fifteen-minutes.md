# Clean Code: The 15-Minute Rule

If you can't explain your code in 15 minutes, it's probably too complex.

## The Rule

Every function, class, or module should be explainable to a colleague in 15 minutes or less.

## Why 15 Minutes?

- **Attention span** - People zone out after 15 minutes
- **Complexity limit** - Forces you to keep things simple
- **Documentation test** - If you can't explain it, how will you document it?

## Bad Example

```javascript
function processUserDataAndGenerateReportWithFiltering(users, filters, options) {
  // 200 lines of nested logic
  // Multiple responsibilities
  // Unclear dependencies
  // Good luck explaining this!
}
```

## Good Example

```javascript
function generateUserReport(users, filters) {
  const filteredUsers = filterUsers(users, filters);
  const reportData = transformForReport(filteredUsers);
  return formatReport(reportData);
}

// Each function is simple and focused
// Easy to test and explain
// Clear data flow
```

## The Clean Code Checklist

- ✅ **Single responsibility** - Does one thing well
- ✅ **Clear naming** - Intent is obvious
- ✅ **Small functions** - Under 20 lines ideally
- ✅ **No side effects** - Predictable behavior

Clean code isn't about being clever, it's about being kind to future you.