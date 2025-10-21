import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Modal from './Modal'; // Update the import path as per your project structure

describe('Modal', () => {
  const mockOnCancel = jest.fn();
  const mockOnConfirm = jest.fn();

  // Test: Modal renders correctly when open is true
  it('renders the modal when open is true', () => {
    render(
      <Modal open={true} title="Test Modal" onCancel={mockOnCancel} onConfirm={mockOnConfirm}>
        <p>Test content</p>
      </Modal>
    );

    // Check if the title and children are displayed
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  // Test: Modal does not render when open is false
  it('does not render the modal when open is false', () => {
    render(
      <Modal open={false} title="Test Modal" onCancel={mockOnCancel} onConfirm={mockOnConfirm}>
        <p>Test content</p>
      </Modal>
    );

    // The modal should not be in the document
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  // Test: Title and description are rendered correctly
  it('renders title and description correctly', () => {
    render(
      <Modal open={true} title="Modal Title" description="This is a description" onCancel={mockOnCancel} onConfirm={mockOnConfirm}>
        <p>Test content</p>
      </Modal>
    );

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  // Test: Children are rendered correctly inside the modal
  it('renders children correctly inside the modal', () => {
    render(
      <Modal open={true} title="Test Modal" onCancel={mockOnCancel} onConfirm={mockOnConfirm}>
        <p>Child content</p>
      </Modal>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  // Test: Cancel button calls onCancel
  it('calls onCancel when the cancel button is clicked', () => {
    render(
      <Modal open={true} title="Test Modal" onCancel={mockOnCancel} onConfirm={mockOnConfirm}>
        <p>Test content</p>
      </Modal>
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  // Test: Confirm button calls onConfirm
  it('calls onConfirm when the confirm button is clicked', () => {
    render(
      <Modal open={true} title="Test Modal" onCancel={mockOnCancel} onConfirm={mockOnConfirm}>
        <p>Test content</p>
      </Modal>
    );

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  // Test: Custom confirm and cancel text
  it('renders custom confirm and cancel text', () => {
    render(
      <Modal
        open={true}
        title="Test Modal"
        confirmText="Proceed"
        cancelText="Go Back"
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
      >
        <p>Test content</p>
      </Modal>
    );

    const cancelButton = screen.getByText('Go Back');
    const confirmButton = screen.getByText('Proceed');

    expect(cancelButton).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
  });
});
