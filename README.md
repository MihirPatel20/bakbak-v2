# bakbak-v2


## 🤝 Contributing

Wanna help make **bakbak-v2** better? Awesome! Here’s a quick guide to keep things clean and consistent.

---

### ✅ Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) to keep commit history readable and meaningful.

| **Tag**    | **When to Use It**                                                                 |
| ---------- | ---------------------------------------------------------------------------------- |
| `feat`     | New features / functionality (e.g., `feat: add login form`)                        |
| `fix`      | Bug fixes (e.g., `fix: crash when submitting empty form`)                          |
| `chore`    | Routine tasks, updates not affecting app logic (e.g., updating deps, config files) |
| `refactor` | Code changes that neither fix bugs nor add features                                |
| `docs`     | Changes to documentation only (e.g., README, comments)                             |
| `style`    | Formatting, whitespace, linting – no logic changes                                 |
| `test`     | Adding or updating tests                                                           |
| `build`    | Build-related stuff (webpack, Docker, etc.)                                        |
| `revert`   | Revert previous commits                                                            |
| `merge`    | Merging branches (if not auto-generated)                                           |

---

### 🧠 Commit Tips

- Use a **scope** when it makes sense:

  ```
  feat(auth): add JWT token support
  fix(player): fix shuffle logic
  ```

- Subject line should be short (≤ 72 chars).

- Use present tense: `add` not `added`.

- Add a body if the "what" needs a "why" or "how."

- For breaking changes:

  ```
  BREAKING CHANGE: replaced old auth API
  ```

---

### 🔧 Temp Debug Commits

Need to log stuff while debugging? Totally cool — just be loud about it so it's easy to clean up later:

```
chore(debug): add console logs to trace playlist shuffle issue
```

```js
console.log("DEBUG shuffle index:", index); // TODO: remove
```

Use `chore(debug):` or mention `temp` to make it obvious that it’s not permanent.