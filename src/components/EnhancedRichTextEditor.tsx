import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, Image, Type, Quote, Code } from 'lucide-react';

interface EnhancedRichTextEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const EnhancedRichTextEditor: React.FC<EnhancedRichTextEditorProps> = ({ 
  initialValue = '', 
  onChange, 
  placeholder = 'Write your content here...' 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [_, setContent] = useState(initialValue); // Use underscore to indicate intentionally unused variable
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [selectionPosition, setSelectionPosition] = useState({ top: 0, left: 0 });
  
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      if (onChange) {
        onChange(newContent);
      }
    }
  };

  // Format document with execCommand - fixed to handle null vs undefined correctly
  const formatDoc = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Handle image insertion
  const insertImage = () => {
    const url = prompt('Enter the image URL:');
    if (url) {
      // Create a figure element with caption
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Article image';
      img.className = 'blog-image';
      figure.appendChild(img);
      
      // Add optional caption
      const captionText = prompt('Enter image caption (optional):');
      if (captionText) {
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = captionText;
        figure.appendChild(figcaption);
      }
      
      // Insert the figure at cursor position
      const selection = window.getSelection();
      if (selection && selection.getRangeAt && selection.rangeCount) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(figure);
        
        // Move cursor after the inserted figure
        range.setStartAfter(figure);
        range.setEndAfter(figure);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      handleInput();
    }
  };

  // Handle link creation
  const createLink = () => {
    const selection = window.getSelection();
    
    if (!selection) return;
    
    // Check if text is selected
    if (selection.toString().length > 0) {
      const url = prompt('Enter the URL:', 'https://');
      if (url) {
        formatDoc('createLink', url);
      }
    } else {
      // If no text is selected, prompt for both URL and link text
      const url = prompt('Enter the URL:', 'https://');
      if (url) {
        const linkText = prompt('Enter the link text:', url);
        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.textContent = linkText || url;
        
        // Insert at cursor position
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(link);
        
        // Move cursor after the inserted link
        range.setStartAfter(link);
        range.setEndAfter(link);
        selection.removeAllRanges();
        selection.addRange(range);
        
        handleInput();
      }
    }
  };

  // Format block elements
  const formatBlock = (block: string) => {
    formatDoc('formatBlock', block);
  };

  // Insert content divider
  const insertDivider = () => {
    const divider = document.createElement('div');
    divider.className = 'content-divider';
    
    // Insert at cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(divider);
      
      // Move cursor after the divider
      range.setStartAfter(divider);
      range.setEndAfter(divider);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    handleInput();
  };

  // Handle selection changes
  const handleSelectionChange = () => {
    const selection = window.getSelection();
    
    // Only show floating toolbar for non-collapsed selections (i.e., when text is selected)
    if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
      // Get selection position
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Position the toolbar above the selection
      setSelectionPosition({
        top: rect.top - 40, // Position above selection
        left: rect.left + (rect.width / 2) - 50, // Center horizontally
      });
      
      setShowFloatingToolbar(true);
    } else {
      setShowFloatingToolbar(false);
    }
  };

  // Setup selection change listener
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return (
    <div className="rich-text-editor border border-gray-600 rounded-lg overflow-hidden bg-gray-800/70">
      {/* Main toolbar */}
      <div className="toolbar border-b border-gray-600 p-2 bg-gray-700/50 flex flex-wrap gap-1">
        <div className="format-buttons flex space-x-1">
          <button
            type="button"
            onClick={() => formatDoc('bold')}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            type="button"
            onClick={() => formatDoc('italic')}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            type="button"
            onClick={() => formatDoc('underline')}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Underline"
          >
            <Underline size={18} />
          </button>
        </div>

        <div className="border-l border-gray-600 mx-1"></div>

        <div className="alignment-buttons flex space-x-1">
          <button
            type="button"
            onClick={() => formatDoc('justifyLeft')}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => formatDoc('justifyCenter')}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>
          <button
            type="button"
            onClick={() => formatDoc('justifyRight')}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
        </div>

        <div className="border-l border-gray-600 mx-1"></div>

        <div className="list-buttons flex space-x-1">
          <button
            type="button"
            onClick={() => formatDoc('insertUnorderedList')}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            type="button"
            onClick={() => formatDoc('insertOrderedList')}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
        </div>

        <div className="border-l border-gray-600 mx-1"></div>

        <div className="insert-buttons flex space-x-1">
          <button
            type="button"
            onClick={createLink}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Insert Link"
          >
            <Link size={18} />
          </button>
          <button
            type="button"
            onClick={insertImage}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Insert Image"
          >
            <Image size={18} />
          </button>
        </div>

        <div className="border-l border-gray-600 mx-1"></div>

        <div className="format-buttons flex space-x-1">
          <button
            type="button"
            onClick={() => formatBlock('<h2>')}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Heading"
          >
            <Type size={18} />
          </button>
          <button
            type="button"
            onClick={() => formatBlock('<blockquote>')}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Quote"
          >
            <Quote size={18} />
          </button>
          <button
            type="button"
            onClick={() => formatBlock('<pre>')}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Code Block"
          >
            <Code size={18} />
          </button>
          <button
            type="button"
            onClick={insertDivider}
            className="p-2 text-indigo-300 hover:bg-gray-600 rounded"
            title="Insert Divider"
          >
            <div className="w-4 h-4 flex items-center justify-center">—</div>
          </button>
        </div>
      </div>

      {/* Editable content area */}
      <div
        ref={editorRef}
        className="content p-4 min-h-[400px] text-indigo-100 focus:outline-none"
        contentEditable="true"
        onInput={handleInput}
        data-placeholder={placeholder}
        spellCheck="true"
      ></div>

      {/* Medium-style floating toolbar on text selection */}
      {showFloatingToolbar && (
        <div 
          className="floating-toolbar absolute bg-gray-800 rounded-full shadow-lg border border-gray-700 p-1 flex space-x-1 z-50"
          style={{
            top: `${selectionPosition.top}px`,
            left: `${selectionPosition.left}px`,
          }}
        >
          <button
            onClick={() => formatDoc('bold')}
            className="p-1 text-indigo-300 hover:bg-gray-700 rounded-full"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => formatDoc('italic')}
            className="p-1 text-indigo-300 hover:bg-gray-700 rounded-full"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={createLink}
            className="p-1 text-indigo-300 hover:bg-gray-700 rounded-full"
          >
            <Link size={16} />
          </button>
          <button
            onClick={() => formatDoc('hiliteColor', '#FAF089')}
            className="p-1 text-indigo-300 hover:bg-gray-700 rounded-full"
            title="Highlight"
          >
            <span className="inline-block w-4 h-4 bg-yellow-200 rounded" aria-hidden="true"></span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedRichTextEditor;