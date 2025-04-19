import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileSelector from './FileSelector';

// Mock implementation for tests
Object.defineProperty(HTMLDivElement.prototype, 'className', {
  get() {
    return this.getAttribute('class') || '';
  },
  set(val) {
    this.setAttribute('class', val);
  },
  configurable: true,
});

describe('FileSelector', () => {
  const mockOnFileSelect = jest.fn();

  beforeEach(() => {
    mockOnFileSelect.mockClear();
    jest.clearAllMocks();
    // Reset any styles that might have been set
    document.body.innerHTML = '';
  });

  it('renders with proper accessibility attributes', () => {
    const { container } = render(
      <FileSelector onFileSelect={mockOnFileSelect} />
    );

    // Get the outer container div by its class
    const outerContainer = container.querySelector('div[role="button"]');
    expect(outerContainer).toBeInTheDocument();
    expect(outerContainer).toHaveAttribute('tabIndex', '0');
    expect(outerContainer).toHaveAttribute('aria-label', 'Attach file');

    // Get the inner button
    const innerButton = container.querySelector('button');
    expect(innerButton).toBeInTheDocument();
    expect(innerButton).toHaveAttribute('aria-label', 'Attach file');

    // Get the paperclip icon
    const paperclipIcon = container.querySelector('span[role="img"]');
    expect(paperclipIcon).toBeInTheDocument();
    expect(paperclipIcon).toHaveAttribute('aria-label', 'Paperclip');
  });

  it('handles keyboard interaction', () => {
    const { container } = render(
      <FileSelector onFileSelect={mockOnFileSelect} />
    );

    // Mock the click function of the input element
    const inputEl = container.querySelector('input[type="file"]');
    if (inputEl) {
      const mockClick = jest.fn();
      Object.defineProperty(inputEl, 'click', {
        value: mockClick,
      });
    }

    const outerContainer = container.querySelector('div[role="button"]');
    expect(outerContainer).toBeInTheDocument();

    // Simulate keyboard events
    fireEvent.keyDown(outerContainer!, { key: 'Enter' });
    fireEvent.keyDown(outerContainer!, { key: ' ' });
  });

  it('handles file selection through input change', () => {
    const { container } = render(
      <FileSelector onFileSelect={mockOnFileSelect} />
    );

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();

    // Create a mock file list
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
    };

    // Trigger the change event
    fireEvent.change(input!, { target: { files: fileList } });

    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
  });

  it('handles drag and drop', () => {
    const { container } = render(
      <FileSelector onFileSelect={mockOnFileSelect} />
    );

    const outerContainer = container.querySelector('div[role="button"]');
    expect(outerContainer).toBeInTheDocument();

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    // Set up the drag events
    fireEvent.dragOver(outerContainer!);

    // Expect isDragging to be true (opacity class should be added)
    expect(outerContainer!.className).toContain('opacity-70');

    // Create a mock file list for dataTransfer
    const fileList = [file];
    Object.defineProperty(fileList, 'item', {
      value: (index: number) => fileList[index],
    });

    fireEvent.drop(outerContainer!, {
      dataTransfer: {
        files: fileList,
      },
    });

    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    // isDragging should be false after drop
    expect(outerContainer!.className).not.toContain('opacity-70');
  });

  it('handles button click to open file dialog', () => {
    const { container } = render(
      <FileSelector onFileSelect={mockOnFileSelect} />
    );

    const inputEl = container.querySelector('input[type="file"]');
    const buttonEl = container.querySelector('button');

    if (inputEl) {
      const mockClick = jest.fn();
      Object.defineProperty(inputEl, 'click', {
        value: mockClick,
      });

      // Trigger button click
      fireEvent.click(buttonEl!);

      expect(mockClick).toHaveBeenCalled();
    }
  });
});
