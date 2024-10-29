import React, { useState } from "react";

type TagsInputProps = {
  tags: string[];
  allTags: string[];
  onAddTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
};

const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  allTags,
  onAddTag,
  onDeleteTag,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedInput = inputValue.trim();
      if (!trimmedInput || trimmedInput.includes(" ")) {
        setErrorMessage("Please enter a valid tag without spaces.");
        return;
      }

      if (!tags.includes(trimmedInput)) {
        onAddTag(trimmedInput);
        setInputValue("");
        setErrorMessage("");
      } else {
        setErrorMessage("Tag already exists.");
      }
    }
  };

  return (
    <div className='flex flex-wrap'>
      <input
        list='tags'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className='border mt-2 p-2 mb-2 w-full rounded'
      />
      <datalist id='tags'>
        {allTags.map((tag) => (
          <option
            key={tag}
            value={tag}
          />
        ))}
      </datalist>

      <ul className='flex flex-wrap'>
        {tags.map((tag) => (
          <li
            key={tag}
            className='flex items-center bg-blue-200 px-2 py-1 mr-2 mb-1 rounded'>
            {tag}{" "}
            <button
              onClick={() => onDeleteTag(tag)}
              className='ml-2 text-red-500 hover:text-red-700'>
              X
            </button>
          </li>
        ))}
      </ul>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default TagsInput;
