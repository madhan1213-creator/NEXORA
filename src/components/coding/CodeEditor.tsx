import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  FileCode2,
  RotateCcw,
  Maximize2,
  Minimize2,
  Check,
  Copy,
  AlertTriangle,
  Code2,
} from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onReset: () => void;
  fileName?: string;
  isModified?: boolean;
  minHeight?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onReset,
  fileName = 'solution.py',
  isModified = false,
  minHeight = '360px',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Calculate lines array
  const lines = useMemo(() => {
    return code.split('\n');
  }, [code]);

  // Synchronize scrolling between textarea and line numbers gutter
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Track cursor position (Line, Column)
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart || 0;
    const textBefore = code.substring(0, pos);
    const lineList = textBefore.split('\n');
    const currentLine = lineList.length;
    const currentCol = lineList[lineList.length - 1].length + 1;
    setCursorPos({ line: currentLine, col: currentCol });
  };

  // Intelligent Python Key Handling (Tab, Auto-Indent on Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Handle Tab and Shift+Tab for 4-space Python indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (!e.shiftKey) {
        // Insert 4 spaces
        const indentation = '    ';
        const newCode = code.substring(0, start) + indentation + code.substring(end);
        onChange(newCode);

        // Reposition cursor
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + indentation.length;
          updateCursorPosition();
        }, 0);
      } else {
        // Shift+Tab: Unindent current line
        const before = code.substring(0, start);
        const lastNewline = before.lastIndexOf('\n');
        const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
        const linePrefix = code.substring(lineStart, lineStart + 4);

        if (linePrefix === '    ') {
          const newCode = code.substring(0, lineStart) + code.substring(lineStart + 4);
          onChange(newCode);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 4);
            updateCursorPosition();
          }, 0);
        }
      }
    }

    // Auto-indent on Enter
    if (e.key === 'Enter') {
      const start = textarea.selectionStart;
      const beforeCursor = code.substring(0, start);
      const currentLineText = beforeCursor.split('\n').pop() || '';
      const match = currentLineText.match(/^(\s*)/);
      let indent = match ? match[1] : '';

      // If line ends with ':' add 4 more spaces for Python block
      if (currentLineText.trim().endsWith(':')) {
        indent += '    ';
      }

      if (indent.length > 0) {
        e.preventDefault();
        const afterCursor = code.substring(start);
        const newCode = beforeCursor + '\n' + indent + afterCursor;
        onChange(newCode);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
          updateCursorPosition();
        }, 0);
      }
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const confirmReset = () => {
    onReset();
    setShowResetConfirm(false);
  };

  return (
    <div
      className={`flex flex-col bg-[#0d1117] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-4 z-50 rounded-2xl border-neutral-700 bg-[#0d1117]'
          : 'w-full'
      }`}
      style={{ minHeight: isFullscreen ? 'calc(100vh - 2rem)' : minHeight }}
    >
      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL IDE TAB BAR & ACTION CONTROLS                             */}
      {/* ========================================================================= */}
      <div className="h-11 px-3 bg-[#161b22] border-b border-neutral-800 flex items-center justify-between select-none shrink-0">
        {/* Left: File Tab (Active solution.py) */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d1117] text-neutral-200 border-t-2 border-emerald-400 border-r border-l border-neutral-800 rounded-t text-xs font-mono font-medium shadow-inner">
            {/* Python Logo Icon */}
            <svg
              className="w-3.5 h-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.927 2C6.98 2 7.29 4.144 7.29 4.144L7.3 6.362H12.016V7.078H5.328C2.553 7.078 2 9.07 2 11.838C2 14.606 2.453 16.55 5.228 16.55H6.848V14.286C6.848 11.666 8.99 11.666 8.99 11.666H13.682C15.824 11.666 16.14 9.57 16.14 9.57V4.288C16.14 4.288 16.388 2 11.927 2ZM9.49 3.518C10.05 3.518 10.504 3.972 10.504 4.532C10.504 5.092 10.05 5.546 9.49 5.546C8.93 5.546 8.476 5.092 8.476 4.532C8.476 3.972 8.93 3.518 9.49 3.518Z"
                fill="#38BDF8"
              />
              <path
                d="M12.073 22C17.02 22 16.71 19.856 16.71 19.856L16.7 17.638H11.984V16.922H18.672C21.447 16.922 22 14.93 22 12.162C22 9.394 21.547 7.45 18.772 7.45H17.152V9.714C17.152 12.334 15.01 12.334 15.01 12.334H10.318C8.176 12.334 7.86 14.43 7.86 14.43V19.712C7.86 19.712 7.612 22 12.073 22ZM14.51 20.482C13.95 20.482 13.496 20.028 13.496 19.468C13.496 18.908 13.95 18.454 14.51 18.454C15.07 18.454 15.524 18.908 15.524 19.468C15.524 20.028 15.07 20.482 14.51 20.482Z"
                fill="#FACC15"
              />
            </svg>
            <span className="text-white font-semibold">{fileName}</span>
            {isModified ? (
              <span
                className="w-2 h-2 rounded-full bg-amber-400"
                title="Unsaved modifications"
              />
            ) : (
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                title="Synchronized"
              />
            )}
          </div>
        </div>

        {/* Right Controls: Telemetry & Actions */}
        <div className="flex items-center gap-2">
          {/* Position counter */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-neutral-400 mr-2">
            <span>
              Ln {cursorPos.line}, Col {cursorPos.col}
            </span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-500">{lines.length} lines</span>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyCode}
            title="Copy code"
            className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition text-xs flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 hidden md:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden md:inline">Copy</span>
              </>
            )}
          </button>

          {/* Reset Code Button */}
          <div className="relative">
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Reset code to starter template"
              className="p-1.5 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden md:inline">Reset</span>
            </button>

            {/* Confirmation Popover */}
            {showResetConfirm && (
              <div className="absolute right-0 top-8 z-50 w-72 p-3 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl text-xs space-y-2 animate-in fade-in zoom-in-95">
                <div className="flex items-start gap-2 text-rose-300 font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>Reset to starter template?</span>
                </div>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  All your current edits in <strong className="text-neutral-200">{fileName}</strong> will be discarded and replaced with the original starter code.
                </p>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2.5 py-1 text-[11px] rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReset}
                    className="px-2.5 py-1 text-[11px] rounded bg-rose-600 text-white hover:bg-rose-500 font-bold"
                  >
                    Yes, Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit full screen' : 'Expand editor full screen'}
            className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EDITOR CANVAS: LINE NUMBERS GUTTER & TEXTAREA                           */}
      {/* ========================================================================= */}
      <div className="relative flex-1 flex overflow-hidden bg-[#0d1117] min-h-[340px]">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-12 py-3 bg-[#0d1117] border-r border-neutral-800/80 text-right pr-3 select-none overflow-hidden font-mono text-[13px] leading-6 text-neutral-600 shrink-0"
        >
          {lines.map((_, i) => (
            <div
              key={i}
              className={`transition-colors ${
                cursorPos.line === i + 1 ? 'text-emerald-400 font-bold' : ''
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Editor Area */}
        <div className="relative flex-1 h-full overflow-hidden">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              onChange(e.target.value);
              updateCursorPosition();
            }}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            placeholder="# Write your Python solution here..."
            className="w-full h-full p-3 font-mono text-[13px] leading-6 bg-[#0d1117] text-neutral-100 placeholder-neutral-600 resize-none border-none outline-none focus:ring-0 focus:outline-none selection:bg-emerald-500/30 selection:text-white overflow-auto whitespace-pre tab-4"
            style={{
              tabSize: 4,
              fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
            }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. EDITOR FOOTER HINT STRIP                                              */}
      {/* ========================================================================= */}
      <div className="h-7 px-3 bg-[#161b22] border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <Code2 className="w-3 h-3" />
            <span>Python 3.11</span>
          </span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-400 hidden sm:inline">Tab = 4 spaces</span>
          <span className="text-neutral-600 hidden sm:inline">•</span>
          <span className="text-neutral-400 hidden sm:inline">UTF-8</span>
        </div>
        <div className="text-neutral-500 text-[10px]">
          Changes saved locally
        </div>
      </div>
    </div>
  );
};
