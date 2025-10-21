# Card Component

    The `Card` component is a reusable, customizable, and responsive UI component built with React. 
    It is designed to serve as a flexible container for displaying content in a visually appealing format. 
    The component supports additional customizations through props and allows developers to 
    pass child elements for dynamic content.

---

## Features

- Styling with Tailwind CSS: Includes default styles like rounded corners, shadow, and border.
- Extensibility: Supports additional customization via the `className` and other HTML attributes.
- Flexible Layout: Designed with a flexbox layout to handle child elements properly.
- Children Support: Dynamically render any React children passed to the component.
- Standardized API: Extends the base behavior of an HTML `div` element for familiarity.

---

## Installation & Setup

1. Add the `Card` component to your project:
   ```tsx
   import Card from "./path/to/Card";
   ```
2. Use the `Card` component in your React code to display any content.

---

## Usage

You can use the `Card` component for a variety of use cases, such as user profile cards, product cards, or lists.

### Basic Example

```tsx
import React from "react";
import Card from "./components/Card";

const App = () => {
  return (
    <div className="p-4">
      <Card>
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="text-gray-600">This is some content inside the card.</p>
      </Card>
    </div>
  );
};

export default App;
```

### With Custom Styles via `className`
You can extend or override the default styles using the `className` prop.

```tsx
<Card className="bg-blue-100 border-blue-300">
  <h3 className="text-blue-800">Custom Card</h3>
  <p>This card uses custom styles.</p>
</Card>
```

### Adding Interactive Elements
You can include buttons, images, or other elements as children.

```tsx
<Card>
  <h3 className="text-lg font-bold">Product Name</h3>
  <p className="text-gray-600">Description of the product.</p>
  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
    Learn More
  </button>
</Card>
```

---

## Props

The `Card` component accepts the following props:

| Prop Name | Type                           | Default                | Required | Description                                                                                                             |
|---------------|------------------------------------|----------------------------|--------------|-----------------------------------------------------------------------------------------------------------------------------|
| `className`   | `string`                          | `""`                       | No           | Additional classes to customize the styling.                                                                                |
| `children`    | `React.ReactNode`                 | `undefined`                | No           | The content rendered inside the card.                                                                                       |
| `...props`    | `React.HTMLAttributes<HTMLDivElement>` | Inferred default behaviors | No           | Any additional props, such as styles, event handlers, or custom attributes inherited from the native `div` HTML element.    |

---

## Styling

The `Card` component uses Tailwind CSS for its default styling. Below are the default utility classes applied:

- Background Color: `bg-[#F5F5F5]` (light gray background).
- Rounded Corners: `rounded-xl`.
- Shadow: `shadow-md`.
- Overflow Handling: `overflow-hidden`.
- Border: `border border-gray-200`.
- Flexbox Layout: `flex flex-col h-full`.

You can easily override these styles by passing a custom CSS class name through the `className` prop.

---

## Customization

    ### Extending with Tailwind
        You can use the `className` prop to modify the card's appearance:
        ```tsx
        <Card className="bg-white shadow-lg border-none">
        <p>This card has a white background and no border.</p>
        </Card>
        ```

    ### Dynamic Card Content
        Include custom components or dynamic content as `children`:
        ```tsx
        <Card>
        <img
            src="https://via.placeholder.com/150"
            alt="sample"
            className="rounded-t-xl h-48 w-full object-cover"
        />
        <div className="p-4">
            <h3 className="text-lg">Dynamic Content</h3>
            <p>Add any type of content dynamically inside the card.</p>
        </div>
        </Card>
        ```

---

## FAQs

### 1. Can I use custom HTML attributes with the Card?
    Yes, the `Card` component extends from `React.HTMLAttributes<HTMLDivElement>`, so you can pass any standard HTML attribute (e.g., `id`, `data-*`, `style`, etc.).

    ```tsx
    <Card id="custom-card" data-testid="card">
    Test Attributes
    </Card>
    ```

### 2. Can I modify the structure or layout of the card?
    Yes, the `Card` component is designed to be flexible. The core structure is controlled by its default classes, but you can override or extend them using the `className` prop or passing child components.

### 3. Is the Card responsive?
    Yes, the `Card` supports responsive layouts inherently due to its flexible `flexbox` structure and Tailwind classes. You can further enhance responsiveness by adding additional styles via the `className` prop.

### 4. Can I nest `Card` components?
    Yes, you can nest multiple `Card` components. They will inherit their styling naturally.

---