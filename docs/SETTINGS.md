# 🛠️ Settings Module – Developer Guide

This doc explains the design and implementation logic of the **user settings system** used in this project. It's meant to help you (or other devs) easily understand and extend the settings functionality, especially when adding new settings.

## 📁 Structure Overview

Settings are implemented in a clean, modular way:

| Layer          | File                                | Purpose                                   |
| -------------- | ----------------------------------- | ----------------------------------------- |
| **Model**      | `models/userSettings.models.js`     | Mongoose schema (DB structure)            |
| **Service**    | `services/settingsService.js`       | DB logic: get/update/create user settings |
| **Controller** | `controllers/settingsController.js` | API routes: GET & PUT                     |
| **Redux**      | `redux/settings/` folder            | State mgmt + optimistic updates           |
| **Push logic** | `settings.actions.js`               | Extra logic for push notifications        |

## 🧩 Settings Shape

All user settings are grouped under logical categories. Here's what a full settings object looks like:

```js
{
  notifications: {
    push: false,
    email: true
  },
  appearance: {
    theme: "light",
    fontSize: "medium"
  },
  interaction: {
    autoPlayVideos: false,
    showTypingIndicators: true
  },
  visibility: {
    profile: "public"
  },
  meta: {
    userId: "...",
    version: 1,
    language: "en",
    createdAt: "...",
    updatedAt: "..."
  }
}
```

## 🔁 Update Flow (Flat Keys via Dot Notation)

We use **flat keys** for nested settings (e.g., `"appearance.theme"`).
Here’s the flow:

1. `dispatch(applySettingChange("appearance.theme", "dark"))`
2. Redux updates state instantly (optimistic UI)
3. Thunk sends it to backend:
   `PUT /settings` → `{ "appearance.theme": "dark" }`
4. Mongo uses `$set` to update nested key

## ✅ How to Add a New Setting

Want to add something like `interaction.sounds.clicks: true`? Do this:

### 1. MongoDB Schema

```js
interaction: {
  ...,
  sounds: {
    clicks: { type: Boolean, default: true }
  }
}
```

### 2. Redux Initial State

```js
interaction: {
  ...,
  sounds: {
    clicks: true
  }
}
```

### 3. Use it in Code

```js
dispatch(applySettingChange("interaction.sounds.clicks", false));
```

Or bulk:

```js
dispatch(
  updateUserSettings({
    "interaction.sounds.clicks": false,
    "appearance.fontSize": "large",
  })
);
```

## 🧠 Meta Fields

All system-level stuff like `userId`, timestamps, and version are grouped into `meta`:

- They come from DB at the root level
- We move them under `state.meta` in Redux
- This keeps things clean and avoids polluting main setting categories

## ⚡ Optimistic Update & Rollback

We update UI instantly. But if the API fails, we roll back:

```js
try {
  await dispatch(updateUserSettings({ ... })).unwrap();
} catch (err) {
  dispatch(fetchUserSettings()); // fetch original values again
}
```

## 🔔 Push Notification Toggle (Special Flow)

The `"notifications.push"` setting also triggers service worker registration/unregistration:

```js
dispatch(applyPushNotificationSetting(true)); // handles everything
```

Defined in:
`redux/settings/settings.actions.js`

## 👀 Dev Tips

- Always use **dot notation** for paths (e.g., `"interaction.autoPlayVideos"`)
- Don’t forget to update **both schema + redux** when adding new settings
- Meta fields like timestamps are auto-managed by Mongoose
- Never mutate `meta` directly – always replace the full object on fetch

## 📝 Example Use Case

**Dark Mode Toggle:**

```js
dispatch(applySettingChange("appearance.theme", "dark"));
```

**Enable Email + Push Notifications Together:**

```js
dispatch(
  updateUserSettings({
    "notifications.email": true,
    "notifications.push": true,
  })
);
```

## 📋 TODO / Improvements

- [ ] Add unit tests for reducer + actions
- [ ] Use Zod or similar for backend schema validation
- [ ] Consider auto-generating Redux initial state from the Mongoose schema
