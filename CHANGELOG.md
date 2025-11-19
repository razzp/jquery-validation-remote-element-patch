# Changelog

## 1.1.0 (2025-11-19)

## Changed

- `onInvalid` callback now returns an object.
- Object returned in the `onInvalid` callback no longer includes the event object.
- Object returned in the `onInvalid` callback now includes the trigger element.

### Fixed

- Field sets are now properly supported.
- Fixed race condition with JQuery Validation itself.

## 1.0.0 (2025-11-18)

Initial release.