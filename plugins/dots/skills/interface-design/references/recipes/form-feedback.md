# Associate Web Form Feedback

Use when implementing field markup, autofill, or validation feedback.

## Error messaging

The complete pattern:

```html
<label for="email">Email</label>
<input
  id="email"
  type="email"
  autocomplete="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error">Enter a valid email address.</p>
```

- `aria-invalid="true"` on the failing field, removed once fixed.
- `aria-describedby` links the field to its inline error so screen readers announce it with the field.
- Errors render inline beside their fields, with an icon or text. Never a red border alone, which is a color-only cue.

On failed submission, focus the first invalid field or an error summary linked to the fields when the form needs an overview. Preserve existing hint IDs in `aria-describedby` when adding an error.

## Autocomplete and input types

Use `autocomplete` with a meaningful `name` for fields collecting recognized personal information. The common tokens:

| Field | `autocomplete` |
| --- | --- |
| Name | `name` (or `given-name` / `family-name`) |
| Email | `email` |
| Phone | `tel` |
| Address | `street-address`, `address-line1`, `postal-code`, `country` |
| Card | `cc-number`, `cc-exp`, `cc-csc`, `cc-name` |
| Login | `username`, `current-password` |
| Signup / reset | `new-password` |
| 2FA code | `one-time-code` |

Distinguish shipping and billing addresses where relevant: `autocomplete="shipping street-address"`.

Correct `type` and `inputmode` pick the right mobile keyboard:

| Input | Use |
| --- | --- |
| Email, URL, phone | `type="email"`, `type="url"`, `type="tel"` |
| OTP / PIN / card number | `type="text" inputmode="numeric"` (keeps text semantics, no spinner) |
| Money, decimals | `type="text" inputmode="decimal"` |
| True numeric quantity | `type="number"` |

Disable spellcheck on emails, codes and usernames: `spellcheck="false"`.

Stay compatible with password managers and 2FA autofill: real `<form>`, correct `autocomplete`, no fake inputs. Preserve passwords and other exact-value fields; normalize whitespace only where the field’s meaning permits it. Keyboard submit shortcuts beyond native behavior belong to the product’s interaction model.

For success, result counts, or form-level failures that need speech without focus moving, read [announcements](announcements.md).
