Brief Summary on Modal Component

    This React component is a reusable and customizable Modal dialog box. It serves as a
    flexible UI component for displaying critical information, warnings, prompts, or confirmations.
    Its modular props-based design allows easy configuration, making it ideal for both developers and
    testers.

---

Features

    - Fully Customizable: Includes props to handle titles, descriptions, button texts, and child content.
    - Overlay Effect: Adds an accessible overlay to focus users' attention.
    - Interactive Buttons: Separate handlers for `Cancel` and `Confirm` actions.
    - Conditional Rendering: The modal renders only when the `open` prop is `true`.
    - Responsive Design: Adapts to smaller devices with a centered design.

---

Installation & Setup

    1. Copy the Component:
        - Copy the `Modal` component code into your project.
    2. Add to a Project:
        - Import and use the `Modal` component in the desired React file:
            ---tsx
                import Modal from './path-to-modal';
            ---
---

## Usage

    Here’s how to use the `Modal` component in a React project:

    ### Basic Example:

    ---tsx
    import React, { useState } from 'react';
    import Modal from './Modal';

    function App() {
    const [isOpen, setIsOpen] = useState(false);

    const handleCancel = () => {
        console.log("Cancel clicked");
        setIsOpen(false);
    };

    const handleConfirm = () => {
        console.log("Confirm clicked");
        setIsOpen(false);
    };

    return (
        <div>
        <button onClick={() => setIsOpen(true)}>Open Modal</button>
        <Modal
            open={isOpen}
            title="Delete File"
            description="Are you sure you want to delete this file? This action cannot be undone."
            onCancel={handleCancel}
            onConfirm={handleConfirm}
        />
        </div>
    );
    }

    export default App;
    ---tsx

---

## Props

The component comes with the following configurable props:

| Prop Name     | Type                   | Required | Default Value  | Description                                                                 |
|---------------|------------------------|----------|----------------|-----------------------------------------------------------------------------|
| `open`        | `boolean`             | Yes  | `false`        | Controls whether the modal is visible or not.                              |
| `title`       | `string`              | Yes  |                | The main title displayed at the top of the modal.                          |
| `description` | `string` (optional)   | No       | `undefined`    | A short optional description or contextual information about the modal.    |
| `confirmText` | `string` (optional)   | No       | `"Confirm"`    | Text for the confirm button.                                               |
| `cancelText`  | `string` (optional)   | No       | `"Cancel"`     | Text for the cancel button.                                                |
| `onCancel`    | `() => void`          | Yes  |                | Callback function triggered when the `Cancel` button is clicked.           |
| `onConfirm`   | `() => void`          | Yes  |                | Callback function triggered when the `Confirm` button is clicked.          |
| `children`    | `React.ReactNode`     | No       | `undefined`    | Optional custom content rendered inside the modal’s body before the footer.|

---

## Example with Custom Children

    You can also pass custom components or JSX elements via the `children` prop to enhance flexibility.

---tsx
<Modal
  open={isOpen}
  title="Upload Document"
  onCancel={handleCancel}
  onConfirm={handleConfirm}
>
  <p>Here’s a custom form:</p>
  <input type="file" />
</Modal>
---

---

## Styling

    The modal uses Tailwind CSS for styling out of the box. To customize it, modify the class 
    names in the component code or refactor it with your preferred CSS framework or styles. 
    Key styles include:

    - Overlay: `bg-black/30` => Creates a semi-transparent dark background.
    - Modal Box: `bg-white rounded-lg shadow-lg` => Styles the modal container.
    - Buttons: `bg-gray-100` for cancel and `bg-red-600` for confirm buttons.

---

## Accessibility

    - The modal uses an overlay with `z-index` for visibility and focus trapping   
        is simplified using React’s rendering logic (controlled by the `open` prop).
    - The modal can be enhanced further with ARIA attributes for improved accessibility.

---

## FAQs

### 1. Can I change the modal design?
    Yes, simply modify the Tailwind CSS class names in the component code or replace the styling with your preferred framework or CSS styles.

### 2. What happens if `description`, `confirmText`, or `cancelText` aren’t included?
- `description`: The modal omits the description section if not provided.
- `confirmText` and `cancelText`: Use the default values (`"Confirm"` and `"Cancel"`), making them optional.

### 3. Is the Modal accessible?
The component handles basic accessibility. However, you can add ARIA attributes for advanced use cases.

---