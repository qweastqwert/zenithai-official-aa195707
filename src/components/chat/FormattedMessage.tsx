import React from 'react';

interface FormattedMessageProps {
  content: string;
  className?: string;
}

const FormattedMessage: React.FC<FormattedMessageProps> = ({ content, className = '' }) => {
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let tableKey = 0;

    const processInlineFormatting = (line: string, key: number): React.ReactNode => {
      // Process bold, italic, and inline code
      const parts: React.ReactNode[] = [];
      let currentIndex = 0;
      
      // Combined regex for **bold**, *italic*, and `code`
      const formatRegex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)/g;
      let match;
      
      while ((match = formatRegex.exec(line)) !== null) {
        // Add text before the match
        if (match.index > currentIndex) {
          parts.push(line.slice(currentIndex, match.index));
        }
        
        if (match[1]) {
          // Bold text
          parts.push(<strong key={`bold-${key}-${match.index}`} className="font-bold">{match[2]}</strong>);
        } else if (match[3]) {
          // Italic text
          parts.push(<em key={`italic-${key}-${match.index}`} className="italic">{match[4]}</em>);
        } else if (match[5]) {
          // Code text
          parts.push(
            <code key={`code-${key}-${match.index}`} className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm font-mono">
              {match[6]}
            </code>
          );
        }
        
        currentIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (currentIndex < line.length) {
        parts.push(line.slice(currentIndex));
      }
      
      return parts.length > 0 ? parts : line;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Check for table rows (lines with |)
      if (trimmedLine.includes('|') && trimmedLine.startsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        
        // Skip separator rows (----)
        if (!trimmedLine.match(/^\|[\s\-:|]+\|$/)) {
          const cells = trimmedLine
            .split('|')
            .filter((cell, idx, arr) => idx !== 0 && idx !== arr.length - 1)
            .map(cell => cell.trim());
          tableRows.push(cells);
        }
        continue;
      } else if (inTable && tableRows.length > 0) {
        // End of table, render it
        elements.push(
          <div key={`table-${tableKey++}`} className="overflow-x-auto my-3">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  {tableRows[0]?.map((header, idx) => (
                    <th key={idx} className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        inTable = false;
        tableRows = [];
      }
      
      // Empty line
      if (!trimmedLine) {
        elements.push(<br key={`br-${i}`} />);
        continue;
      }
      
      // Numbered list (1. 2. 3.)
      const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
      if (numberedMatch) {
        elements.push(
          <div key={`num-${i}`} className="flex items-start gap-2 my-1">
            <span className="font-semibold text-gray-600 dark:text-gray-400 min-w-[1.5rem]">{numberedMatch[1]}.</span>
            <span>{processInlineFormatting(numberedMatch[2], i)}</span>
          </div>
        );
        continue;
      }
      
      // Bullet points (-, •, *)
      const bulletMatch = trimmedLine.match(/^[-•*]\s+(.+)$/);
      if (bulletMatch) {
        elements.push(
          <div key={`bullet-${i}`} className="flex items-start gap-2 my-1 ml-2">
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <span>{processInlineFormatting(bulletMatch[1], i)}</span>
          </div>
        );
        continue;
      }
      
      // Regular paragraph
      elements.push(
        <p key={`p-${i}`} className="my-1">
          {processInlineFormatting(line, i)}
        </p>
      );
    }
    
    // Handle remaining table at end of content
    if (inTable && tableRows.length > 0) {
      elements.push(
        <div key={`table-${tableKey++}`} className="overflow-x-auto my-3">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                {tableRows[0]?.map((header, idx) => (
                  <th key={idx} className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, rowIdx) => (
                <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    return elements;
  };

  return (
    <div className={`formatted-message ${className}`}>
      {renderFormattedContent(content)}
    </div>
  );
};

export default FormattedMessage;
