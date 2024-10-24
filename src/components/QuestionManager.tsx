import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
export type QuestionType =
  | "SINGLE_LINE"
  | "MULTI_LINE"
  | "INTEGER"
  | "CHECKBOX";

export type Question = {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  displayedInTable: boolean;
  options?: string[];
};

type QuestionManagerProps = {
  questions: Question[];
  onAddQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onQuestionChange: (id: string, field: keyof Question, value: any) => void;
};

const QuestionManager: React.FC<QuestionManagerProps> = ({
  questions,
  onAddQuestion,
  onDeleteQuestion,
  onQuestionChange,
}) => {
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      title: "New Question",
      description: "",
      type: "SINGLE_LINE",
      displayedInTable: false,
      options: [],
    };
    onAddQuestion(newQuestion);
  };

  return (
    <div className='space-y-4'>
      {questions.map((q) => (
        <div
          key={q.id}
          className='p-4 border rounded-lg shadow-md space-y-4'>
          <div className='flex items-center justify-between space-x-4'>
            <input
              value={q.title}
              onChange={(e) => onQuestionChange(q.id, "title", e.target.value)}
              placeholder='Question Title'
              className='p-2 border rounded-lg w-1/2'
              maxLength={50}
              aria-label='Question Title'
            />

            <select
              value={q.type}
              onChange={(e) => onQuestionChange(q.id, "type", e.target.value)}
              className='p-2 border rounded-lg w-1/3'
              aria-label='Question Type'>
              <option value='SINGLE_LINE'>Single-line</option>
              <option value='MULTI_LINE'>Multi-line</option>
              <option value='INTEGER'>Integer</option>
              <option value='CHECKBOX'>Checkbox</option>
            </select>

            <button
              onClick={() => onDeleteQuestion(q.id)}
              className='text-red-500 font-bold'
              aria-label='Delete Question'>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>

          {/* Description Input (Prompt) */}
          {q.type === "SINGLE_LINE" ? (
            <input
              value={q.description}
              onChange={(e) =>
                onQuestionChange(q.id, "description", e.target.value)
              }
              placeholder='Question Description'
              className='p-2 border rounded-lg w-full'
              maxLength={100}
              aria-label='Question Description'
            />
          ) : (
            <textarea
              value={q.description}
              onChange={(e) =>
                onQuestionChange(q.id, "description", e.target.value)
              }
              placeholder='Question Description / Prompt'
              className='p-2 border rounded-lg w-full'
              rows={2}
              aria-label='Question Description'
            />
          )}

          {/* Dynamic Input Preview Based on Question Type */}
          {q.type === "SINGLE_LINE" && (
            <input
              type='text'
              placeholder='Single-line Answer Preview'
              className='p-2 border rounded-lg w-full'
              disabled
              aria-label='Single-line Answer Preview'
            />
          )}

          {q.type === "MULTI_LINE" && (
            <textarea
              placeholder='Multi-line Answer Preview'
              className='p-2 border rounded-lg w-full'
              rows={3}
              disabled
              aria-label='Multi-line Answer Preview'
            />
          )}

          {q.type === "INTEGER" && (
            <input
              type='number'
              placeholder='Integer Answer Preview'
              className='p-2 border rounded-lg w-full'
              disabled
              aria-label='Integer Answer Preview'
            />
          )}

          {q.type === "CHECKBOX" && (
            <div>
              <p className='font-semibold'>Checkbox Options:</p>
              {q.options?.map((option, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2'>
                  <span className='text-lg'>☐️</span>
                  <input
                    type='text'
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...(q.options || [])];
                      updatedOptions[index] = e.target.value;
                      onQuestionChange(q.id, "options", updatedOptions);
                    }}
                    placeholder='Option'
                    className='p-2 border-t-0 border-r-0 border-l-0 rounded-lg w-full'
                    aria-label={`Option ${index + 1}`}
                  />
                  <button
                    onClick={() => {
                      const updatedOptions = q.options?.filter(
                        (_, i) => i !== index
                      );
                      onQuestionChange(q.id, "options", updatedOptions);
                    }}
                    className='text-red-500 font-bold'
                    aria-label='Remove Option'>
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  onQuestionChange(q.id, "options", [...(q.options || []), ""])
                }
                className='text-green-500 font-bold mt-2'
                aria-label='Add Option'>
                Add Option
              </button>
            </div>
          )}
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={q.displayedInTable}
              onChange={(e) =>
                onQuestionChange(q.id, "displayedInTable", e.target.checked)
              }
              aria-label='Display in Table'
            />
            <span className='font-semibold'>Display in Table</span>
          </label>
        </div>
      ))}

      <button
        onClick={handleAddQuestion}
        className='mt-2 p-2 bg-blue-500 text-white font-bold rounded-lg w-full'
        aria-label='Add New Question'>
        Add New Question
      </button>
    </div>
  );
};

export default QuestionManager;
